# freeWriter API Documentation

This document outlines the API endpoints for the freeWriter application. These endpoints are implemented as serverless functions on Vercel.

## Base URL

All API requests should be prefixed with: `https://your-vercel-app-url.vercel.app/api`

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### User Management

#### Register a new user

- **POST** `/api/users/register`
- **Body**: 
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "writingMode": "Plotter" | "Pantser"
  }
  ```
- **Response**: JWT token

#### Login

- **POST** `/api/users/login`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token

### Stories

#### Get all stories for a user

- **GET** `/api/stories`
- **Response**: Array of story objects

#### Create a new story

- **POST** `/api/stories/create`
- **Body**:
  ```json
  {
    "title": "string",
    "content": "string"
  }
  ```
- **Response**: Created story object

... (rest of the API documentation)

#### Recovery password

- **POST**: `/.netlify/functions/forgetPassword`
- **Body**:
```json
{
  "email": string
}
```

#### IA conversation

- **POST**: `.netlify/functions/api/ai/interaction`
- **Body**:
```json
{
  "message": string,
}
```

#### Generating new prompt

- **POST**: `.netlify/functions/api/ai/generate-Promt`
- **Body**:
```json
{
  "title": string,
  "WritingMode": "Plotter | Pantser",
}
```

#### New feedback
- **POST**: `.netlify/functions/api/ai/submit-feedback`
- **Body**:
```json
{
  "storyId": string, 
  "promptId": string, 
  "guidanceId": string, 
  "rating": number, 
  "comments": string
}
```