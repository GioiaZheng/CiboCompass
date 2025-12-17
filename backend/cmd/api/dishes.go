package main

import (
	"encoding/json"
	"net/http"
	"strings"

	"backend.CiboCompass.net/internal/database"
)

func (app *application) dishdetailsHandler(response http.ResponseWriter, request *http.Request) {
	dishName, err := app.ReadDishNameParam(request)
	if err != nil {
		app.notFoundResponse(response)
		return
	}

	nationality, err := app.ReadUserNationality(request)
	if err != nil {
		app.notFoundResponse(response)
		return
	}
	dish, err := database.GetDishDetails(app.db, app.logger, dishName, nationality)
	if err != nil {
		if err == database.ErrDishNotFound {
			app.notFoundResponse(response)
		} else {
			app.serverErrorResponse(response, err)
		}
		return
	}

	jsonResponse := struct {
		Success bool           `json:"success"`
		Data    *database.Dish `json:"data"`
	}{
		Success: true,
		Data:    dish,
	}

	err = app.writeJSON(response, http.StatusOK, jsonResponse, nil)
	if err != nil {
		app.serverErrorResponse(response, err)
		return
	}
}

func (app *application) dishfeedbackHandler(response http.ResponseWriter, request *http.Request) {
	dishName, err := app.ReadDishNameParam(request)
	if err != nil {
		app.notFoundResponse(response)
		return
	}

	nationality, err := app.ReadUserNationality(request)
	if err != nil {
		app.notFoundResponse(response)
		return
	}

	feedback, err := app.ReadDishFeedback(request)
	if err != nil {
		app.badRequestResponse(response, err.Error())
		return
	}

	err = database.UpdateDishFeedback(app.db, app.logger, dishName, nationality, feedback)
	if err != nil {
		if err == database.ErrDishNotFound {
			app.notFoundResponse(response)
		} else {
			app.serverErrorResponse(response, err)
		}
		return
	}

	jsonResponse := struct {
		Success bool   `json:"success"`
		Message string `json:"message"`
	}{
		Success: true,
		Message: "Feedback recorded successfully",
	}

	err = app.writeJSON(response, http.StatusOK, jsonResponse, nil)
	if err != nil {
		app.serverErrorResponse(response, err)
		return
	}
}

func (app *application) listDishesHandler(response http.ResponseWriter, request *http.Request) {
	dishes, err := database.ListDishes(app.db, app.logger)
	if err != nil {
		app.serverErrorResponse(response, err)
		return
	}

	jsonResponse := struct {
		Success bool            `json:"success"`
		Data    []database.Dish `json:"data"`
	}{
		Success: true,
		Data:    dishes,
	}

	err = app.writeJSON(response, http.StatusOK, jsonResponse, nil)
	if err != nil {
		app.serverErrorResponse(response, err)
		return
	}
}

func (app *application) createDishHandler(response http.ResponseWriter, request *http.Request) {
	var input struct {
		Name        string   `json:"name"`
		ImageURL    string   `json:"img"`
		Description string   `json:"description"`
		Ingredients []string `json:"ingredients"`
	}

	decoder := json.NewDecoder(request.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		app.badRequestResponse(response, "invalid request body")
		return
	}

	input.Name = strings.TrimSpace(input.Name)
	input.ImageURL = strings.TrimSpace(input.ImageURL)
	input.Description = strings.TrimSpace(input.Description)

	if input.Name == "" || len(input.Ingredients) == 0 {
		app.badRequestResponse(response, "dish name and at least one ingredient are required")
		return
	}

	var ingredients []database.Ingredient
	for _, ing := range input.Ingredients {
		clean := strings.TrimSpace(ing)
		if clean == "" {
			continue
		}
		ingredients = append(ingredients, database.Ingredient{Name: clean})
	}

	if len(ingredients) == 0 {
		app.badRequestResponse(response, "dish must include at least one valid ingredient")
		return
	}

	newDish := database.Dish{
		Name:        input.Name,
		ImageURL:    input.ImageURL,
		Description: input.Description,
		Ingredients: ingredients,
	}

	createdDish, err := database.AddDish(app.db, app.logger, newDish)
	if err != nil {
		if err == database.ErrDishAlreadyExists {
			app.badRequestResponse(response, "dish already exists")
			return
		}
		app.serverErrorResponse(response, err)
		return
	}

	jsonResponse := struct {
		Success bool           `json:"success"`
		Data    *database.Dish `json:"data"`
	}{
		Success: true,
		Data:    createdDish,
	}

	err = app.writeJSON(response, http.StatusCreated, jsonResponse, nil)
	if err != nil {
		app.serverErrorResponse(response, err)
		return
	}
}
