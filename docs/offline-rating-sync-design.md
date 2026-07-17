# Versioned Offline Rating Synchronization Design

**Status:** Proposed  
**Scope:** Rating mutations only  
**Decision required before implementation:** device-scoped anonymous identity or
authenticated user identity

## Problem

The current client persists a pending feedback queue and the backend deduplicates
retries by idempotency key. This protects one mutation from being counted twice,
but it does not define which mutation wins when requests arrive out of order.
The backend also stores aggregate counters, so it cannot replace an individual
actor's previous rating.

The target model treats a rating as mutable state owned by an actor. Delivery
remains at-least-once; idempotency and monotonic sequencing make application of
that state deterministic.

## Invariants

1. One actor has at most one current rating for a dish/nationality pair.
2. Replaying one mutation never changes state twice.
3. An older client mutation never overwrites a newer accepted mutation.
4. Aggregate likes and dislikes are derived from current actor ratings, not from
   an append-only increment path.
5. The server response always identifies the accepted sequence and current
   server version.
6. Queue state transitions on the client are serialized and crash-safe at the
   `AsyncStorage` persistence boundary.

## Identity Decision

The protocol requires a stable `actor_id`.

| Option | Benefits | Costs |
|---|---|---|
| Device-scoped anonymous UUID | Works without accounts; small product change | Ratings do not follow the user across devices; reinstall identity must be defined |
| Authenticated user ID | True cross-device ownership and convergence | Requires authentication, account recovery, and privacy controls first |

Do not derive identity from nationality, IP address, timestamps, or an
idempotency key. Until authentication exists, a random device-scoped UUID stored
in secure device storage is the smallest defensible option. The API should treat
the value as an opaque identifier and logs should avoid emitting it.

## Mutation Contract

```json
{
  "mutationId": "01J...",
  "actorId": "opaque-device-or-user-id",
  "clientSequence": 42,
  "dishName": "Pizza Margherita",
  "nationality": "Italy",
  "rating": 4,
  "createdAt": "2025-06-01T12:00:00.000Z"
}
```

- `mutationId` is globally unique and reused for every retry of one mutation.
- `clientSequence` is strictly increasing for one actor and persisted before the
  mutation is queued.
- `rating` remains the source value; the server derives `like` or `dislike`
  using one versioned mapping rule.
- The server does not trust `createdAt` for ordering.

Successful and stale requests both return the current server state:

```json
{
  "applied": true,
  "acceptedSequence": 42,
  "serverVersion": 7,
  "rating": 4
}
```

For an out-of-order mutation, `applied` is `false` and the other fields describe
the state already stored. This is a successful convergence response, not a
transport error.

## Storage Model

```sql
CREATE TABLE Ratings (
    actorID TEXT NOT NULL,
    dishName TEXT NOT NULL,
    nationality TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    lastClientSequence INTEGER NOT NULL,
    serverVersion INTEGER NOT NULL,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (actorID, dishName, nationality),
    FOREIGN KEY (dishName) REFERENCES Dishes(name)
);

CREATE TABLE RatingMutations (
    mutationID TEXT PRIMARY KEY,
    actorID TEXT NOT NULL,
    clientSequence INTEGER NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

`RatingMutations` is the idempotency ledger. `Ratings` is the current-state
table. Aggregate counts are queried from `Ratings` with the server's versioned
rating-to-sentiment rule.

## Transaction Rule

Within one database transaction:

1. Validate the dish, rating range, actor, mutation ID, and sequence.
2. If `mutationID` already exists, return the current rating unchanged.
3. Read the current row for `(actorID, dishName, nationality)`.
4. Apply the mutation only when `clientSequence` is greater than
   `lastClientSequence`; otherwise return the current row with `applied=false`.
5. Upsert the current rating and increment `serverVersion`.
6. Record `mutationID` in the idempotency ledger.
7. Commit and return the authoritative state.

SQLite writes remain serialized. The existing busy timeout and WAL policy
handle bounded contention; application code must still retry a transient busy
result without changing the mutation ID or sequence.

## Client Queue Model

Queue operations must run through one serialized mutation function so enqueue,
acknowledgement, and retry updates cannot overwrite each other's snapshots.
Each item carries:

- `mutationId`, `actorId`, and `clientSequence`,
- `status`: `pending`, `in_flight`, `backoff`, or `dead_letter`,
- `attemptCount`, `lastAttemptAt`, and `nextAttemptAt`,
- the rating payload and local timestamps.

Backoff should be capped exponential backoff with jitter. Only connectivity and
transient server failures are retryable. Validation and authorization failures
move to `dead_letter` and remain inspectable. A newer rating may replace an
older **unsent** item for the same actor/dish/nationality key, but it must keep
the newer sequence. An in-flight item is not deleted until its response is
reconciled.

## Migration

Existing `Feedbacks` counters cannot be losslessly converted to actor-scoped
ratings because they contain no actor identity or mutation order.

1. Add the new tables and endpoint without changing existing reads.
2. Ship a client that creates and persists actor identity and sequence state.
3. Dual-read aggregate results from the legacy counters plus the new ratings
   during a named compatibility window, clearly marking the metric definition.
4. Stop legacy writes after supported clients migrate.
5. Choose explicitly whether to archive legacy totals or reset public aggregates
   to actor-scoped data. Do not silently reinterpret historical counters.
6. Remove the legacy endpoint and tables only in a versioned migration.

## Verification

The implementation is not complete until tests cover:

- duplicate delivery of the same mutation,
- newer-then-older arrival ordering,
- rating replacement without double counting,
- concurrent writes for one actor key,
- independent actors rating the same dish,
- process restart with queued and in-flight items,
- queue write interleavings,
- retry backoff boundaries and jitter,
- migration with legacy aggregate data,
- logs and error responses that do not expose actor identifiers or credentials.

## Rollout Phases

1. Decide and document actor identity and retention policy.
2. Add schema, transactional repository method, and backend tests.
3. Introduce a versioned API endpoint and contract tests.
4. Serialize client queue operations; add sequence, backoff, and reconciliation.
5. Run migration and failure-injection tests.
6. Update product language to **offline-first synchronization** only after the
   ordering, replacement, restart, and migration invariants pass.

