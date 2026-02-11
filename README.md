
## Backend

- Node.js
- TypeScript
- Express.js
- TypeORM
- MySQL database
- JWT for authentication
- bcryptjs for password hashing

## Setup & Run
- Prerequisites
- Node.js (v18 or higher)
- MySQL (XAMPP or similar)


## Clone the repository:
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

# Api Endpoints
## API Endpoints

| Method | Endpoint              | Description                     | Auth? |
|--------|-----------------------|---------------------------------|-------|
| POST   | /api/auth/signup      | Register new user               | No    |
| POST   | /api/auth/signin      | Login & get JWT token           | No    |
| POST   | /api/tasks            | Create new task                 | Yes   |
| GET    | /api/tasks            | List all my tasks               | Yes   |
| GET    | /api/tasks/:id        | Get one task                    | Yes   |
| PUT    | /api/tasks/:id        | Update task (title, desc, done) | Yes   |
| DELETE | /api/tasks/:id        | Delete task                     | Yes   |

## Postman Collection

**File**: `taskmanger.postman_collection.json`

### Structure & Usage

- **auth** folder: Signup + Signin (public — run first to get token)
- **tasks** folder: Create, Get all, Get one, Update, Delete (protected — uses Bearer {{token}})

**Steps**:
1. Import the collection into Postman
2. Run Signin (or Signup) → token is auto-saved
3. Run any request in the **tasks** folder

Important Decisions During Implementation

### Backend (Server Side)

1. **Using Node.js, Express, and TypeScript**  
   I used Node.js with Express to build the backend.  
   I used TypeScript instead of JavaScript.  

   **Why?**  
   - TypeScript helps catch mistakes early  
   - Code becomes clearer and easier to understand

2. **Splitting the Code into Folders**  
   The backend is divided into:  
   - Routes  
   - Controllers  
   - Entities  
   - Middlewares  

   **Why?**  
   - Each file has one job  
   - Easier to read and fix problems  
   - Code is more organized

3. **Using JWT for Login**  
   When the user logs in, the server sends a JWT token.  
   This token is used to check if the user is logged in.  

   **Why?**  
   - Secure way to log in  
   - No need to save sessions on the server

4. **Protecting Task APIs**  
   Task routes can only be used if the user is logged in.  
   This is done using an authentication middleware.  

   **Why?**  
   - Only the user can see and manage their own tasks

5. **Using MySQL Database**  
   I used MySQL to store users and tasks.  
   TypeORM is used to connect the app to the database.  

   **Why?**  
   - MySQL is reliable  
   - Easy to manage relations between users and tasks

6. **Using .env File**  
   Database info and secret keys are stored in a .env file.  

   **Why?**  
   - Keeps passwords safe  
   - Easy to change settings later

All protected endpoints use Bearer Authentication automatically.

