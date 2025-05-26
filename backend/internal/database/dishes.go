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
	Like        float64      `json:"like"`
	Dislike     float64      `json:"dislike"`
	Nationality string       `json:"nationality"`
	Ingredients []Ingredient `json:"ingredients"`
	Comments    []string     `json:"comments,omitempty"`
}

type Logger interface {
	Printf(format string, v ...interface{})
	Fatalf(format string, v ...interface{})
}

var ErrDishNotFound = errors.New("dish not found")

func GetDishDetails(db *sql.DB, logger Logger, dishName string, nationality string) (*Dish, error) {
	dishQuery := `
		SELECT name, img 
		FROM Dishes 
		WHERE name = ?
	`
	
	var dish Dish
	err := db.QueryRow(dishQuery, dishName).Scan(
		&dish.Name,
		&dish.ImageURL,
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
	
	dish.Ingredients = ingredients
	dish.Nationality = nationality
	
	// Get dish comments
	comments, err := GetDishComments(db, logger, dishName)
	if err != nil && err != ErrDishNotFound {
		logger.Printf("Error getting comments: %v", err)
		return nil, err
	}
	dish.Comments = comments
	
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

func AddDishComment(db *sql.DB, logger Logger, dishName string, comment string) error {
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

	queryStr := `INSERT INTO Comments (dishName, comment) VALUES (?, ?)`
	_, err = db.Exec(queryStr, dishName, comment)
	if err != nil {
		logger.Printf("Error adding comment: %v", err)
		return err
	}
	
	logger.Printf("Successfully added comment for dish '%s'", dishName)
	return nil
}

func GetDishComments(db *sql.DB, logger Logger, dishName string) ([]string, error) {
	dishQuery := `SELECT COUNT(*) FROM Dishes WHERE name = ?`
	var count int
	err := db.QueryRow(dishQuery, dishName).Scan(&count)
	if err != nil {
		logger.Printf("Error checking if dish exists: %v", err)
		return nil, err
	}
	
	if count == 0 {
		logger.Printf("Dish '%s' not found", dishName)
		return nil, ErrDishNotFound
	}

	commentsQuery := `SELECT comment FROM Comments WHERE dishName = ?`
	rows, err := db.Query(commentsQuery, dishName)
	if err != nil {
		logger.Printf("Error querying comments: %v", err)
		return nil, err
	}
	defer rows.Close()
	
	var comments []string
	for rows.Next() {
		var comment string
		err := rows.Scan(&comment)
		if err != nil {
			logger.Printf("Error scanning comment: %v", err)
			return nil, err
		}
		comments = append(comments, comment)
	}
	
	if err = rows.Err(); err != nil {
		logger.Printf("Error iterating comment rows: %v", err)
		return nil, err
	}
	
	return comments, nil
}