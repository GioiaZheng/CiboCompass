package main

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() *httprouter.Router {
	router := httprouter.New()
	router.GlobalOPTIONS = http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		response.Header().Set("Access-Control-Allow-Origin", "*")
		response.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		response.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-User-Nationality")
		response.WriteHeader(http.StatusOK)
	})
	
	router.HandlerFunc(http.MethodGet,"/v1/healthcheck", app.healthcheckHandler)
	router.HandlerFunc(http.MethodGet,"/v1/dishes/:dishName", app.dishdetailsHandler)
	router.HandlerFunc(http.MethodPost,"/v1/dishes/:dishName/feedback", app.dishfeedbackHandler)
	
	return router
}