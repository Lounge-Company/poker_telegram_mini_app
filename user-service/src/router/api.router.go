package router

import (
	"user-service/src/api/v1/controller"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
    r := gin.Default()
    r.SetTrustedProxies([]string{"127.0.0.1"})
    apiRoutes := r.Group("/api")
    {
        apiRoutes.GET("/", controller.HelloApi)
    }
    // userRoutes := r.Group("/users")
    // {
    //     userRoutes.GET("/:id", controller.GetUser)
    //     userRoutes.POST("/", controller.CreateUser)
    // }

    return r
}