package main

import (
	"net/http"
)

func (app *application) badRequestResponse(response http.ResponseWriter, message string) {
	app.errorResponse(response, http.StatusBadRequest, message)
}

func (app *application) notFoundResponse(response http.ResponseWriter) {
	app.errorResponse(response, http.StatusNotFound, "resource not found")
}

func (app *application) serverErrorResponse(response http.ResponseWriter, err error) {
	app.errorResponse(response, http.StatusInternalServerError, err.Error())
}

func (app *application) errorResponse(response http.ResponseWriter, status int, message string) {
	jsonresponse := struct {
		Error   string `json:"error"`
		Success bool   `json:"success"`
	}{
		Error:   message,
		Success: false,
	}
	
	err := app.writeJSON(response, status, jsonresponse, nil)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("internal server error"))
	}
}