package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HelloApi(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, API!",
	})
}