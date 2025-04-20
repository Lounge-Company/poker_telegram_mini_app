package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUser(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
        "message": "Get single user",
    })
}

func CreateUser(c *gin.Context) {
    c.JSON(http.StatusCreated, gin.H{
        "message": "User created",
    })
}