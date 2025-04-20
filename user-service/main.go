package main

import (
	"fmt"
	"user-service/src/router"

	"github.com/gin-gonic/gin"
)

func main() {
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
