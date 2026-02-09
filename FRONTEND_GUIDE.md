# Frontend Setup Guide - Task Manager

This guide will help you set up the React frontend for the Task Manager application.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A running Task Manager backend (see backend README)
- Code editor (VS Code recommended)

## Project Setup

### 1. Create React Application with TypeScript

```bash
npx create-react-app task-manager-frontend --template typescript
cd task-manager-frontend
```

### 2. Install Dependencies

```bash
npm install
npm install axios react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install --save-dev @types/react-router-dom
```

Or if using Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── SignupForm.tsx
│   │   └── SigninForm.tsx
│   ├── Tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskDashboard.tsx
│   └── Layout/
│       ├── Navbar.tsx
│       └── ProtectedRoute.tsx
├── services/
│   ├── api.ts
│   ├── authService.ts
│   └── taskService.ts
├── types/
│   ├── auth.types.ts
│   ├── task.types.ts
│   └── api.types.ts
├── pages/
│   ├── SignupPage.tsx
│   ├── SigninPage.tsx
│   ├── TaskDashboardPage.tsx
│   └── NotFoundPage.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── styles/
│   └── index.css
├── App.tsx
└── index.tsx
```

## Key Files Implementation

### 1. API Service (src/services/api.ts)

```typescript
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Auth Context (src/context/AuthContext.tsx)

```typescript
import React, { createContext, useState, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = useCallback((userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3. Types (src/types/task.types.ts)

```typescript
export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}
```

### 4. Task Service (src/services/taskService.ts)

```typescript
import api from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task.types';

export const taskService = {
  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await api.post('/tasks', data);
    return response.data.data;
  },

  async getTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
```

### 5. Task Dashboard Component Example

```typescript
import React, { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';
import { Task } from '../types/task.types';

export const TaskDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await taskService.createTask({
        title: newTaskTitle,
        description: newTaskDesc,
      });
      setNewTaskTitle('');
      setNewTaskDesc('');
      await loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await taskService.updateTask(task.id, {
        isCompleted: !task.isCompleted,
      });
      await loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.fullName}!</h1>
      
      <button onClick={logout}>Logout</button>

      <div className="task-form">
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks yet. Create one to get started!</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="task-item">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleToggleTask(task)}
                />
                <div>
                  <h3 className={task.isCompleted ? 'completed' : ''}>
                    {task.title}
                  </h3>
                  {task.description && <p>{task.description}</p>}
                </div>
                <button onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
```

## Environment Variables

Create a `.env` file in the frontend root:

```
REACT_APP_API_URL=http://localhost:3000/api
```

## Running the Frontend

```bash
npm start
```

The app will run on `http://localhost:3000`

## Features to Implement

1. **Authentication Pages**
   - Sign up with email validation
   - Sign in with JWT token storage
   - Form validation with feedback

2. **Task Management**
   - Create new tasks with title and description
   - View all user tasks
   - Edit task details
   - Mark tasks as complete/incomplete
   - Delete tasks

3. **UI/UX**
   - Responsive design for mobile and desktop
   - Loading states during API calls
   - Error handling and display
   - Success notifications
   - Navigation between pages

4. **Best Practices**
   - Protected routes (redirect to signin if not authenticated)
   - Token-based authentication
   - Error boundary components
   - Loading skeleton components
   - Local storage for user session
   - Logout functionality

## Testing

Add tests using Jest and React Testing Library:

```bash
npm test
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Deployment Tips

- Deploy backend to a cloud service (Heroku, AWS, DigitalOcean, etc.)
- Update `REACT_APP_API_URL` to point to your deployed backend
- Deploy frontend to Vercel, Netlify, or GitHub Pages
- Ensure CORS is properly configured on the backend

## Common Issues

1. **CORS errors**: Make sure the backend CORS_ORIGIN matches your frontend URL
2. **API not found**: Verify the API_URL environment variable
3. **Token not persisting**: Check localStorage permissions
4. **404 errors on refresh**: Configure routing for SPA (usually required for static hosts)

## Next Steps

After implementing both frontend and backend:
1. Test all features with the provided Postman collection
2. Add unit tests (at least 80% coverage)
3. Optimize performance (code splitting, lazy loading)
4. Document design decisions in README
5. Push to GitHub and share the repository URL
