package main

import ( 
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
	"database/sql"
	"backend.CiboCompass.net/internal/database"
)

const version = "1.0.0"

type config struct {
	port	int
	env		string
	db		struct {
		path string
	}
}

type application struct {
	config	config
	logger	*log.Logger
	db		*sql.DB
}

func main(){
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.db.path, "db-path", "./data/cibo.db", "SQLite database path")
	flag.Parse()

	logger := log.New(os.Stdout, "", log.Ldate | log.Ltime)

	db, err := database.OpenDatabase(cfg.db.path)
	if err != nil {
		logger.Fatalf("cannot open database: %v", err)
	}
	defer db.Close()

	err = database.InitDatabase(db)
	if err != nil {
		logger.Fatalf("cannot initialize database: %v", err)
	}

	app := &application{
		config : cfg,
		logger : logger,
		db : db,
	}

	srv := &http.Server{
		Addr: fmt.Sprintf("0.0.0.0:%d", cfg.port),
		Handler: app.routes(),
		IdleTimeout: time.Minute,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	logger.Printf("starting %s server on %s", cfg.env, srv.Addr)
	err = srv.ListenAndServe()
	logger.Fatal(err)
}
