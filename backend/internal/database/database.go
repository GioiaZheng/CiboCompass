package database

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

func OpenDatabase(path string) (*sql.DB, error) {
	dir := filepath.Dir(path)
	err := os.MkdirAll(dir, 0755)
	if err != nil {
		return nil, fmt.Errorf("failed to create database directory: %w", err)
	}
	db, err := sql.Open("sqlite3", path)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}
	if err = db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	return db, nil
}

func InitDatabase(db *sql.DB) error {
	query := `
	CREATE TABLE IF NOT EXISTS Dishes (
	name TEXT NOT NULL PRIMARY KEY,
	img TEXT
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

	CREATE TABLE IF NOT EXISTS Comments (
	dishName TEXT NOT NULL,
	comment TEXT NOT NULL,
	FOREIGN KEY (dishName) REFERENCES Dishes(name)
	);
	`
	_, err := db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create database tables: %w", err)
	}
	return nil
}