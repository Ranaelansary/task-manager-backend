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
git clone https://github.com/RanaElansary/task-manager-backend.git
cd task-manager-backend

```

2. Install dependencies:
```bash
npm install
```

# Server Configuration
```bash
NODE_ENV=development
PORT=5000
```

# Database Configuration
```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Nouran_20021999
DB_NAME=task_manager
```
# JWT Configuration
```bash
JWT_SECRET=793dc845bac7bb643bd42e8df6679e4098be52f717a5ec46319ed24f50a90f6cd2384959cabc2fd1db89a576cc3260987c77230c3d52ec994538d5fb94f53bbe
JWT_EXPIRATION=1h
```

Run the backend server:
```bash
npm run dev
```
The server will start on `http://localhost:5000`

```

# API Endpoints

| Method | Endpoint              | Description                     | Auth? |
|--------|-----------------------|---------------------------------|-------|
| POST   | /api/auth/signup      | Register new user               | No    |
| POST   | /api/auth/signin      | Login & get JWT token           | No    |
| POST   | /api/tasks            | Create new task                 | Yes   |
| GET    | /api/tasks            | List all my tasks               | Yes   |
| GET    | /api/tasks/:id        | Get one task                    | Yes   |
| PUT    | /api/tasks/:id        | Update task (title, desc, done) | Yes   |
| DELETE | /api/tasks/:id        | Delete task                     | Yes   |
