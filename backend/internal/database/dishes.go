package database

import (
	"database/sql"
	"errors"
)

type Ingredient struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Dish struct {
	ID          int          `json:"id"`
	Name        string       `json:"name"`
	ImageURL    string       `json:"img"`
	Description string       `json:"description"`
	Like        float64      `json:"like"`
	Dislike     float64      `json:"dislike"`
	Nationality string       `json:"nationality"`
	Ingredients []Ingredient `json:"ingredients"`
}

type Logger interface {
	Printf(format string, v ...interface{})
	Fatalf(format string, v ...interface{})
}

var ErrDishNotFound = errors.New("dish not found")
var ErrDishAlreadyExists = errors.New("dish already exists")

func getIngredientsForDish(db *sql.DB, logger Logger, dishName string) ([]Ingredient, error) {
	ingredientsQuery := `
SELECT i.id, i.ingredientName
FROM Ingredients i
JOIN DishesToIngredients di ON i.id = di.ingredientID
WHERE di.dishName = ?
`

	rows, err := db.Query(ingredientsQuery, dishName)
	if err != nil {
		logger.Printf("Error querying ingredients: %v", err)
		return nil, err
	}
	defer rows.Close()

	var ingredients []Ingredient
	for rows.Next() {
		var ingredient Ingredient
		err := rows.Scan(&ingredient.ID, &ingredient.Name)
		if err != nil {
			logger.Printf("Error scanning ingredient: %v", err)
			return nil, err
		}
		ingredients = append(ingredients, ingredient)
	}

	if err = rows.Err(); err != nil {
		logger.Printf("Error iterating ingredient rows: %v", err)
		return nil, err
	}

	return ingredients, nil
}

func GetDishDetails(db *sql.DB, logger Logger, dishName string, nationality string) (*Dish, error) {
	dishQuery := `
SELECT name, img, description
FROM Dishes
		WHERE name = ?
	`

	var dish Dish
	err := db.QueryRow(dishQuery, dishName).Scan(
		&dish.Name,
		&dish.ImageURL,
		&dish.Description,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			logger.Printf("Dish '%s' not found", dishName)
			return nil, ErrDishNotFound
		}
		logger.Printf("Error querying dish: %v", err)
		return nil, err
	}

	feedbackQuery := `
		SELECT like, dislike 
		FROM Feedbacks 
		WHERE dishName = ? AND nationality = ?
	`

	err = db.QueryRow(feedbackQuery, dishName, nationality).Scan(
		&dish.Like,
		&dish.Dislike,
	)

	if err != nil && err != sql.ErrNoRows {
		logger.Printf("Error querying feedback: %v", err)
		return nil, err
	}

	ingredients, err := getIngredientsForDish(db, logger, dishName)
	if err != nil {
		return nil, err
	}

	dish.Ingredients = ingredients
	dish.Nationality = nationality

	logger.Printf("Successfully retrieved details for dish '%s' and nationality '%s'", dishName, nationality)
	return &dish, nil
}

func UpdateDishFeedback(db *sql.DB, logger Logger, dishName string, nationality string, feedback string) error {
	dishQuery := `SELECT COUNT(*) FROM Dishes WHERE name = ?`
	var count int
	err := db.QueryRow(dishQuery, dishName).Scan(&count)
	if err != nil {
		logger.Printf("Error checking if dish exists: %v", err)
		return err
	}

	if count == 0 {
		logger.Printf("Dish '%s' not found", dishName)
		return ErrDishNotFound
	}

	checkQuery := `SELECT COUNT(*) FROM Feedbacks WHERE dishName = ? AND nationality = ?`
	err = db.QueryRow(checkQuery, dishName, nationality).Scan(&count)
	if err != nil {
		logger.Printf("Error checking existing feedback: %v", err)
		return err
	}

	var queryStr string
	if count == 0 {
		if feedback == "like" {
			queryStr = `INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES (?, ?, 1, 0)`
		} else {
			queryStr = `INSERT INTO Feedbacks (dishName, nationality, like, dislike) VALUES (?, ?, 0, 1)`
		}

		_, err = db.Exec(queryStr, dishName, nationality)
		if err != nil {
			logger.Printf("Error inserting new feedback: %v", err)
			return err
		}
	} else {
		if feedback == "like" {
			queryStr = `UPDATE Feedbacks SET like = like + 1, dislike = dislike WHERE dishName = ? AND nationality = ?`
		} else {
			queryStr = `UPDATE Feedbacks SET dislike = dislike + 1, like = like WHERE dishName = ? AND nationality = ?`
		}

		_, err = db.Exec(queryStr, dishName, nationality)
		if err != nil {
			logger.Printf("Error updating feedback: %v", err)
			return err
		}
	}

	logger.Printf("Successfully updated '%s' feedback for dish '%s' and nationality '%s'",
		feedback, dishName, nationality)
	return nil
}

func ListDishes(db *sql.DB, logger Logger) ([]Dish, error) {
	query := `
SELECT d.name, d.img, d.description,
COALESCE(SUM(f.like), 0) AS like,
COALESCE(SUM(f.dislike), 0) AS dislike
FROM Dishes d
LEFT JOIN Feedbacks f ON d.name = f.dishName
GROUP BY d.name, d.img, d.description
ORDER BY d.name
`

	rows, err := db.Query(query)
	if err != nil {
		logger.Printf("Error listing dishes: %v", err)
		return nil, err
	}
	defer rows.Close()

	var dishes []Dish
	for rows.Next() {
		var dish Dish
		if err := rows.Scan(&dish.Name, &dish.ImageURL, &dish.Description, &dish.Like, &dish.Dislike); err != nil {
			logger.Printf("Error scanning dish: %v", err)
			return nil, err
		}

		ingredients, err := getIngredientsForDish(db, logger, dish.Name)
		if err != nil {
			return nil, err
		}
		dish.Ingredients = ingredients
		dishes = append(dishes, dish)
	}

	if err = rows.Err(); err != nil {
		logger.Printf("Error iterating dish rows: %v", err)
		return nil, err
	}

	return dishes, nil
}

func AddDish(db *sql.DB, logger Logger, dish Dish) (*Dish, error) {
	tx, err := db.Begin()
	if err != nil {
		logger.Printf("Error starting transaction: %v", err)
		return nil, err
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	var existingCount int
	err = tx.QueryRow(`SELECT COUNT(*) FROM Dishes WHERE name = ?`, dish.Name).Scan(&existingCount)
	if err != nil {
		logger.Printf("Error checking existing dish: %v", err)
		return nil, err
	}

	if existingCount > 0 {
		return nil, ErrDishAlreadyExists
	}

	_, err = tx.Exec(`INSERT INTO Dishes (name, img, description) VALUES (?, ?, ?)`, dish.Name, dish.ImageURL, dish.Description)
	if err != nil {
		logger.Printf("Error inserting dish: %v", err)
		return nil, err
	}

	for _, ingredient := range dish.Ingredients {
		_, err = tx.Exec(`INSERT OR IGNORE INTO Ingredients (ingredientName) VALUES (?)`, ingredient.Name)
		if err != nil {
			logger.Printf("Error inserting ingredient '%s': %v", ingredient.Name, err)
			return nil, err
		}

		var ingredientID int
		err = tx.QueryRow(`SELECT id FROM Ingredients WHERE ingredientName = ?`, ingredient.Name).Scan(&ingredientID)
		if err != nil {
			logger.Printf("Error retrieving ingredient id for '%s': %v", ingredient.Name, err)
			return nil, err
		}

		_, err = tx.Exec(`INSERT OR IGNORE INTO DishesToIngredients (dishName, ingredientID) VALUES (?, ?)`, dish.Name, ingredientID)
		if err != nil {
			logger.Printf("Error linking ingredient '%s' to dish '%s': %v", ingredient.Name, dish.Name, err)
			return nil, err
		}
	}

	if err = tx.Commit(); err != nil {
		logger.Printf("Error committing dish creation: %v", err)
		return nil, err
	}

	ingredients, err := getIngredientsForDish(db, logger, dish.Name)
	if err != nil {
		return nil, err
	}

	createdDish := dish
	createdDish.Ingredients = ingredients
	createdDish.Like = 0
	createdDish.Dislike = 0

	logger.Printf("Successfully created dish '%s' with %d ingredients", dish.Name, len(ingredients))
	return &createdDish, nil
}
