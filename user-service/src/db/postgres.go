package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitPostgres() {
	connStr := os.Getenv("POSTGRES_CONN") // храним строку подключения в .env
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open connection:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping DB:", err)
	}

	DB = db
	fmt.Println("✅ Connected to PostgreSQL")
}