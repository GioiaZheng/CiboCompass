package main

import (
	"net/http"
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
		Success bool          `json:"success"`
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