package main

import (
	"net/http"
)

func (app *application) healthcheckHandler(response http.ResponseWriter, request *http.Request) {
	data := struct {
		Status      string `json:"status"`
		Environment string `json:"environment"`
		Version     string `json:"version"`
		Success     bool   `json:"success"`
	}{
		Status:      "available",
		Environment: app.config.env,
		Version:     version,
		Success:     true,
	}
	app.writeJSON(response, http.StatusOK, data, nil)
}