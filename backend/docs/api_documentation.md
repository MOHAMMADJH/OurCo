# OurCo API Documentation

## Overview
This documentation provides details about the OurCo API endpoints, authentication methods, and usage examples.

## Authentication

### JWT Authentication
The API uses JWT (JSON Web Token) for authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Authentication Endpoints

#### Login
- **URL**: `/api/auth/login/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "access": "access_token_here",
    "refresh": "refresh_token_here"
  }
  ```

#### Refresh Token
- **URL**: `/api/auth/refresh/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "refresh": "your_refresh_token"
  }
  ```
- **Response**:
  ```json
  {
    "access": "new_access_token_here"
  }
  ```

## API Endpoints

### Projects

#### List Projects
- **URL**: `/api/projects/`
- **Method**: `GET`
- **Authentication**: Required
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Project Title",
      "description": "Project Description",
      "status": "in_progress",
      "created_at": "2024-03-15T12:00:00Z"
    }
  ]
  ```

#### Create Project
- **URL**: `/api/projects/`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "New Project",
    "description": "Project Description",
    "status": "pending"
  }
  ```

### Blog Posts

#### List Blog Posts
- **URL**: `/api/blog/`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `per_page`: Items per page (default: 10)
- **Response**:
  ```json
  {
    "count": 100,
    "next": "http://api.ourco.com/api/blog/?page=2",
    "previous": null,
    "results": [
      {
        "id": 1,
        "title": "Blog Post Title",
        "content": "Blog post content",
        "author": "Author Name",
        "created_at": "2024-03-15T12:00:00Z"
      }
    ]
  }
  ```

### Services

#### List Services
- **URL**: `/api/services/`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Service Name",
      "description": "Service Description",
      "price": "99.99"
    }
  ]
  ```

### User Management

#### Get User Profile
- **URL**: `/api/users/profile/`
- **Method**: `GET`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2024-03-15T12:00:00Z"
  }
  ```

#### Update User Profile
- **URL**: `/api/users/profile/`
- **Method**: `PATCH`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe"
  }
  ```

## Error Responses

### Common Error Codes
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Rate Limiting
API requests are limited to 100 requests per minute per user. The following headers are included in the response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1500000000
```

## Versioning
The API version is included in the URL path. The current version is v1:
```
https://api.ourco.com/api/v1/
```