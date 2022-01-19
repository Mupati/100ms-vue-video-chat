package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

type RequestBody struct {
	UserId string `json:"user_id"`
	RoomId string `json:"room_id"`
	Role   string `json:"role"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {

	var f RequestBody

	b := []byte(request.Body)
	err1 := json.Unmarshal(b, &f)
	if err1 != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: http.StatusUnprocessableEntity,
		}, errors.New("Provide user_id, room_id and room in the request body")
	}

	appAccessKey := os.Getenv("APP_ACCESS_KEY")
	appSecret := os.Getenv("APP_SECRET")

	mySigningKey := []byte(appSecret)
	expiresIn := uint32(24 * 3600)
	now := uint32(time.Now().UTC().Unix())
	exp := now + expiresIn
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"access_key": appAccessKey,
		"type":       "app",
		"version":    2,
		"room_id":    f.RoomId,
		"user_id":    f.UserId,
		"role":       f.Role,
		"jti":        uuid.New().String(),
		"iat":        now,
		"exp":        exp,
		"nbf":        now,
	})

	// Sign and get the complete encoded token as a string using the secret
	signedToken, err := token.SignedString(mySigningKey)

	if err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    map[string]string{"Content-Type": "application/json"},
			Body:       "Internal server error",
		}, err
	}

	return &events.APIGatewayProxyResponse{
		StatusCode:      http.StatusOK,
		Headers:         map[string]string{"Content-Type": "application/json"},
		Body:            signedToken,
		IsBase64Encoded: false,
	}, nil
}

func main() {
	lambda.Start(handler)
}
