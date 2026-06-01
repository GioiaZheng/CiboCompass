package main

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"backend.CiboCompass.net/internal/database"
)

func newTestApplication(t *testing.T) *application {
	t.Helper()

	db, err := database.OpenDatabase(filepath.Join(t.TempDir(), "test.db"))
	if err != nil {
		t.Fatalf("open test database: %v", err)
	}

	t.Cleanup(func() {
		if err := db.Close(); err != nil {
			t.Fatalf("close test database: %v", err)
		}
	})

	if err := database.InitDatabase(db); err != nil {
		t.Fatalf("initialize test database: %v", err)
	}

	app := &application{
		logger: log.New(io.Discard, "", 0),
		db:     db,
	}
	app.config.env = "test"

	return app
}

func TestHealthcheckHandler(t *testing.T) {
	app := newTestApplication(t)

	request := httptest.NewRequest(http.MethodGet, "/v1/healthcheck", nil)
	response := httptest.NewRecorder()

	app.routes().ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}
	if !bytes.Contains(response.Body.Bytes(), []byte(`"success":true`)) {
		t.Fatalf("expected success response, got %s", response.Body.String())
	}
}

func TestCreateAndListDishes(t *testing.T) {
	app := newTestApplication(t)

	body := bytes.NewBufferString(`{
		"name": "Pizza Margherita",
		"img": "https://example.com/pizza.jpg",
		"description": "Classic pizza",
		"ingredients": ["Tomato", "Mozzarella", "Basil"]
	}`)
	request := httptest.NewRequest(http.MethodPost, "/v1/dishes", body)
	response := httptest.NewRecorder()

	app.routes().ServeHTTP(response, request)

	if response.Code != http.StatusCreated {
		t.Fatalf("expected status %d, got %d: %s", http.StatusCreated, response.Code, response.Body.String())
	}

	request = httptest.NewRequest(http.MethodGet, "/v1/dishes", nil)
	response = httptest.NewRecorder()

	app.routes().ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, response.Code)
	}
	if !bytes.Contains(response.Body.Bytes(), []byte("Pizza Margherita")) {
		t.Fatalf("expected created dish in list response, got %s", response.Body.String())
	}
}

func TestCreateDishRejectsInvalidPayload(t *testing.T) {
	app := newTestApplication(t)

	request := httptest.NewRequest(http.MethodPost, "/v1/dishes", bytes.NewBufferString(`{"name": ""}`))
	response := httptest.NewRecorder()

	app.routes().ServeHTTP(response, request)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
	}
}

func TestFeedbackHandler(t *testing.T) {
	app := newTestApplication(t)

	dish := database.Dish{
		Name:        "Pizza Margherita",
		ImageURL:    "https://example.com/pizza.jpg",
		Description: "Classic pizza",
		Ingredients: []database.Ingredient{
			{Name: "Tomato"},
			{Name: "Mozzarella"},
		},
	}
	if _, err := database.AddDish(app.db, app.logger, dish); err != nil {
		t.Fatalf("create test dish: %v", err)
	}

	request := httptest.NewRequest(
		http.MethodPost,
		"/v1/dishes/Pizza%20Margherita/feedback",
		bytes.NewBufferString(`{"feedback":"like"}`),
	)
	request.Header.Set("X-User-Nationality", "Italy")
	response := httptest.NewRecorder()

	app.routes().ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d: %s", http.StatusOK, response.Code, response.Body.String())
	}
}

func TestFeedbackHandlerRejectsInvalidFeedback(t *testing.T) {
	app := newTestApplication(t)

	request := httptest.NewRequest(
		http.MethodPost,
		"/v1/dishes/Pizza%20Margherita/feedback",
		bytes.NewBufferString(`{"feedback":"maybe"}`),
	)
	request.Header.Set("X-User-Nationality", "Italy")
	response := httptest.NewRecorder()

	app.routes().ServeHTTP(response, request)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d", http.StatusBadRequest, response.Code)
	}
}
