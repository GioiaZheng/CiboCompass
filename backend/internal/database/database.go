package database

import (
	"database/sql"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

const (
	sqliteMaxOpenConnections = 8
	sqliteMaxIdleConnections = 4
	sqliteBusyTimeoutMillis  = 5000
)

func OpenDatabase(path string) (*sql.DB, error) {
	filename := path
	if queryStart := strings.IndexRune(path, '?'); queryStart >= 0 {
		filename = path[:queryStart]
	}
	if strings.TrimSpace(filename) == "" {
		return nil, fmt.Errorf("database path is empty")
	}

	dir := filepath.Dir(filename)
	err := os.MkdirAll(dir, 0755)
	if err != nil {
		return nil, fmt.Errorf("failed to create database directory: %w", err)
	}

	dsn, err := buildSQLiteDSN(path)
	if err != nil {
		return nil, err
	}

	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}
	db.SetMaxOpenConns(sqliteMaxOpenConnections)
	db.SetMaxIdleConns(sqliteMaxIdleConnections)

	if err = db.Ping(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	return db, nil
}

func buildSQLiteDSN(path string) (string, error) {
	base := path
	rawQuery := ""
	if queryStart := strings.IndexRune(path, '?'); queryStart >= 0 {
		base = path[:queryStart]
		rawQuery = path[queryStart+1:]
	}

	query, err := url.ParseQuery(rawQuery)
	if err != nil {
		return "", fmt.Errorf("failed to parse database options: %w", err)
	}

	query.Set("_busy_timeout", fmt.Sprintf("%d", sqliteBusyTimeoutMillis))
	query.Set("_foreign_keys", "on")
	query.Set("_journal_mode", "WAL")

	return base + "?" + query.Encode(), nil
}

func InitDatabase(db *sql.DB) error {
	query := `
	CREATE TABLE IF NOT EXISTS Dishes (
	name TEXT NOT NULL PRIMARY KEY,
	img TEXT,
	description TEXT
	);

	CREATE TABLE IF NOT EXISTS Ingredients (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	ingredientName TEXT NOT NULL UNIQUE
	);

	CREATE TABLE IF NOT EXISTS DishesToIngredients (
	dishName TEXT NOT NULL,
	ingredientID INTEGER NOT NULL,
	PRIMARY KEY (dishName, ingredientID),
	FOREIGN KEY (dishName) REFERENCES Dishes(name),
	FOREIGN KEY (ingredientID) REFERENCES Ingredients(id)
	);

	CREATE TABLE IF NOT EXISTS Feedbacks (
	dishName TEXT NOT NULL,
	nationality TEXT NOT NULL,
	like REAL DEFAULT 0,
	dislike REAL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS FeedbackSubmissions (
	idempotencyKey TEXT NOT NULL PRIMARY KEY,
	dishName TEXT NOT NULL,
	nationality TEXT NOT NULL,
	feedback TEXT NOT NULL,
	createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (dishName) REFERENCES Dishes(name)
	);
	`
	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create database tables: %w", err)
	}
	return nil
}
