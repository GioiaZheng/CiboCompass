# CiboCompass Backend

Go REST API for the CiboCompass mobile client. The backend stores dish data,
ingredients, and nationality-specific feedback in SQLite.

## Requirements

- Go 1.23 or newer
- CGO-enabled SQLite build support for `github.com/mattn/go-sqlite3`

On Windows, the SQLite driver requires a working MinGW-w64 toolchain. If local
CGO linking fails, run the backend tests in Linux, WSL, or a containerized Go
environment.

## Run

```bash
go run ./cmd/api
```

Default settings:

| Setting | Value |
|---|---|
| Address | `0.0.0.0:4000` |
| Environment | `development` |
| SQLite path | `./data/cibo.db` |

Override the defaults:

```bash
go run ./cmd/api -port 4001 -env development -db-path ./data/cibo.db
```

## Load Sample Data

After the database has been initialized once, load the sample dishes:

```bash
sqlite3 ./data/cibo.db < sample_data.sql
```

## API

### Healthcheck

```http
GET /v1/healthcheck
```

Example response:

```json
{
  "status": "available",
  "environment": "development",
  "version": "1.0.0",
  "success": true
}
```

### List Dishes

```http
GET /v1/dishes
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "name": "Pizza Margherita",
      "img": "https://example.com/pizza.jpg",
      "description": "Classic Neapolitan pizza.",
      "like": 0,
      "dislike": 0,
      "nationality": "",
      "ingredients": [
        { "id": 1, "name": "Tomato" }
      ]
    }
  ]
}
```

### Create Dish

```http
POST /v1/dishes
Content-Type: application/json
```

Request:

```json
{
  "name": "Pizza Margherita",
  "img": "https://example.com/pizza.jpg",
  "description": "Classic Neapolitan pizza.",
  "ingredients": ["Tomato", "Mozzarella", "Basil"]
}
```

### Get Dish Details

```http
GET /v1/dishes/Pizza%20Margherita
X-User-Nationality: Italy
```

### Record Feedback

```http
POST /v1/dishes/Pizza%20Margherita/feedback
Content-Type: application/json
X-User-Nationality: Italy
```

Request:

```json
{
  "feedback": "like"
}
```

`feedback` must be either `like` or `dislike`.

## Tests

```bash
go test ./...
```
