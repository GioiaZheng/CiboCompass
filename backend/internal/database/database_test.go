package database

import (
	"context"
	"database/sql"
	"io"
	"log"
	"net/url"
	"path/filepath"
	"strings"
	"testing"
)

func TestOpenDatabaseConfiguresPoolAndEveryConnection(t *testing.T) {
	db, err := OpenDatabase(filepath.Join(t.TempDir(), "pool.db"))
	if err != nil {
		t.Fatalf("OpenDatabase: %v", err)
	}
	defer db.Close()

	if got := db.Stats().MaxOpenConnections; got != sqliteMaxOpenConnections {
		t.Fatalf("MaxOpenConnections = %d, want %d", got, sqliteMaxOpenConnections)
	}

	ctx := context.Background()
	connections := make([]*sql.Conn, 0, 2)
	for index := 0; index < 2; index++ {
		conn, err := db.Conn(ctx)
		if err != nil {
			t.Fatalf("acquire connection: %v", err)
		}
		connections = append(connections, conn)
	}
	defer func() {
		for _, conn := range connections {
			_ = conn.Close()
		}
	}()

	for index, conn := range connections {
		var foreignKeys int
		if err := conn.QueryRowContext(ctx, "PRAGMA foreign_keys").Scan(&foreignKeys); err != nil {
			t.Fatalf("connection %d foreign_keys: %v", index, err)
		}
		if foreignKeys != 1 {
			t.Errorf("connection %d foreign_keys = %d, want 1", index, foreignKeys)
		}

		var busyTimeout int
		if err := conn.QueryRowContext(ctx, "PRAGMA busy_timeout").Scan(&busyTimeout); err != nil {
			t.Fatalf("connection %d busy_timeout: %v", index, err)
		}
		if busyTimeout != sqliteBusyTimeoutMillis {
			t.Errorf("connection %d busy_timeout = %d, want %d", index, busyTimeout, sqliteBusyTimeoutMillis)
		}
	}
}

func TestInitDatabaseEnforcesForeignKeys(t *testing.T) {
	db, err := OpenDatabase(filepath.Join(t.TempDir(), "foreign-keys.db"))
	if err != nil {
		t.Fatalf("OpenDatabase: %v", err)
	}
	defer db.Close()

	if err := InitDatabase(db); err != nil {
		t.Fatalf("InitDatabase: %v", err)
	}
	if _, err := db.Exec(`INSERT INTO DishesToIngredients (dishName, ingredientID) VALUES ('missing', 999)`); err == nil {
		t.Fatal("insert with missing parents succeeded; foreign keys are not enforced")
	}
}

func TestListDishesWorksWithSingleConnection(t *testing.T) {
	db, err := OpenDatabase(filepath.Join(t.TempDir(), "list.db"))
	if err != nil {
		t.Fatalf("OpenDatabase: %v", err)
	}
	defer db.Close()

	if err := InitDatabase(db); err != nil {
		t.Fatalf("InitDatabase: %v", err)
	}
	if _, err := db.Exec(`
		INSERT INTO Dishes (name, img, description) VALUES ('Pasta', 'pasta.png', 'Test dish');
		INSERT INTO Ingredients (ingredientName) VALUES ('Tomato');
		INSERT INTO DishesToIngredients (dishName, ingredientID)
			SELECT 'Pasta', id FROM Ingredients WHERE ingredientName = 'Tomato';
	`); err != nil {
		t.Fatalf("seed dishes: %v", err)
	}

	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)

	logger := log.New(io.Discard, "", 0)
	dishes, err := ListDishes(db, logger)
	if err != nil {
		t.Fatalf("ListDishes: %v", err)
	}
	if len(dishes) != 1 {
		t.Fatalf("len(dishes) = %d, want 1", len(dishes))
	}
	if len(dishes[0].Ingredients) != 1 || dishes[0].Ingredients[0].Name != "Tomato" {
		t.Fatalf("ingredients = %#v, want Tomato", dishes[0].Ingredients)
	}
}

func TestBuildSQLiteDSNOverridesConnectionOptions(t *testing.T) {
	dsn, err := buildSQLiteDSN("test.db?_foreign_keys=off&_busy_timeout=1")
	if err != nil {
		t.Fatalf("buildSQLiteDSN: %v", err)
	}

	queryStart := strings.IndexRune(dsn, '?')
	if queryStart < 0 {
		t.Fatalf("DSN %q has no query options", dsn)
	}
	query, err := url.ParseQuery(dsn[queryStart+1:])
	if err != nil {
		t.Fatalf("parse DSN query: %v", err)
	}

	if got := query.Get("_foreign_keys"); got != "on" {
		t.Errorf("_foreign_keys = %q, want on", got)
	}
	if got := query.Get("_busy_timeout"); got != "5000" {
		t.Errorf("_busy_timeout = %q, want 5000", got)
	}
	if got := query.Get("_journal_mode"); got != "WAL" {
		t.Errorf("_journal_mode = %q, want WAL", got)
	}
}
