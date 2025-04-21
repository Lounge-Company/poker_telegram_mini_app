package main

import (
	"fmt"
	"log"
	"user-service/src/db"
	"user-service/src/router"

	"github.com/gin-gonic/gin"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	db.InitPostgres()

	// Устанавливаем режим "release" для продакшн
	gin.SetMode(gin.ReleaseMode)

	// Создаём кастомный логгер с миллисекундами
	r := router.SetupRouter()
	r.Use(gin.LoggerWithWriter(gin.DefaultWriter))

	// Запуск сервера
	port := ":8080"
	fmt.Printf("🚀 Server started at: http://localhost%s\n", port)

	if err := r.Run(port); err != nil {
		panic(err)
	}
}
