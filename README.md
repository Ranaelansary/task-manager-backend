# Task Manager Backend

A production-ready Task Manager API built with Express.js, TypeScript, and MySQL with TypeORM.

## Features

- **Authentication**: JWT-based authentication for signup and signin
- **Task Management**: CRUD operations for personal tasks
- **Validation**: Input validation with class-validator
- **Error Handling**: Comprehensive error handling with custom error classes
- **Database**: MySQL with TypeORM for type-safe database operations
- **Security**: Password hashing with bcryptjs

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL 5.7 or higher
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
JWT_SECRET=your_secret_key
```

5. Create the database:
```bash
mysql -u root -p
CREATE DATABASE task_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000`

### Build
```bash
npm run build
```

### Production Mode
```bash
npm start
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Sign Up
- **POST** `/auth/signup`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "SecurePass123!@"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "token": "jwt_token"
  }
}
```

#### Sign In
- **POST** `/auth/signin`
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!@"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "token": "jwt_token"
  }
}
```

### Task Endpoints (All Protected - Requires Authorization Header)

#### Create Task
- **POST** `/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Buy milk, bread, and eggs"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Buy milk, bread, and eggs",
    "isCompleted": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get All Tasks
- **GET** `/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "description": "Buy milk, bread, and eggs",
      "isCompleted": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Task by ID
- **GET** `/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200): Same as individual task object

#### Update Task
- **PUT** `/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body** (all fields optional):
```json
{
  "title": "Updated task",
  "description": "Updated description",
  "isCompleted": true
}
```
- **Success Response** (200): Updated task object

#### Delete Task
- **DELETE** `/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

### Health Check
- **GET** `/health`
- **Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Password Validation

Passwords must meet the following criteria:
- Minimum 8 characters
- At least one letter (uppercase or lowercase)
- At least one number
- At least one special character (@$!%*?&)

Example of valid password: `SecurePass123!@`

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (email already exists)
- `500`: Internal Server Error

## Project Structure

```
src/
├── config/           # Database configuration
├── controllers/      # Request handlers
├── dtos/            # Data transfer objects
├── entities/        # TypeORM entities
├── middlewares/     # Express middlewares
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions and constants
├── app.ts           # Express app setup
├── server.ts        # Server initialization
└── index.ts         # Entry point
```

## Design Decisions and Rationale

### 1. **Separation of Concerns**
- Controllers handle HTTP logic
- Services contain business logic
- Repositories manage data access
- This ensures maintainability and testability

### 2. **DTOs (Data Transfer Objects)**
- Validates input data at the entry point
- Provides type safety with TypeScript
- Separates API contracts from entity models
- Enables clear error messages for validation failures

### 3. **Custom Error Class (ApiError)**
- Centralizes error handling
- Provides consistent error responses
- Allows custom status codes per error type

### 4. **JWT Authentication**
- Stateless authentication
- Suitable for REST APIs and microservices
- Token-based approach allows scalability
- Middleware validates tokens on protected routes

### 5. **TypeORM**
- Provides type-safe database operations
- Automatic schema generation with `synchronize: true` in development
- Relationship mapping between entities
- Query builder for complex queries

### 6. **Validation Middleware**
- Validates all inputs before reaching controllers
- Uses class-validator for declarative validation
- Returns detailed validation errors to clients

### 7. **Environment Configuration**
- Separates configuration from code
- Supports different environments (dev, prod)
- Sensitive data not hardcoded

## Testing with Postman

A Postman collection is provided (`task-manager-api.postman_collection.json`). To use it:

1. Import the collection into Postman
2. Set the `base_url` variable to `http://localhost:3000/api`
3. Sign up or sign in to get a token
4. Use the token in the `Authorization` header for protected routes

## Future Enhancements

- [ ] Swagger/OpenAPI documentation
- [ ] Unit and integration tests
- [ ] Pagination for task list
- [ ] Task categories/tags
- [ ] Task due dates and priorities
- [ ] Task sharing between users
- [ ] Email notifications
- [ ] Rate limiting
- [ ] Request logging

## License

ISC

## Support

For issues or questions, please create a GitHub issue.
