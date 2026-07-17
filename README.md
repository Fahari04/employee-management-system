# Employee Management System

A full-stack Employee Management System built with **Node.js/Express** (backend), **PostgreSQL** (database), and **React** (frontend). Features JWT authentication, full CRUD operations, and employee search/filtering.

## Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Testing with Postman](#testing-with-postman)
- [Extending the Application](#extending-the-application)

---

## Architecture

```
┌─────────────┐     HTTP/JSON     ┌──────────────────┐     SQL     ┌──────────────┐
│  React UI   │ ◄──────────────► │  Express API     │ ◄─────────► │  PostgreSQL  │
│  (Port 3000)│                   │  (Port 5000)     │             │  (Port 5432) │
│             │                   │                  │             │              │
│ • Auth Pages│                   │ • JWT Auth       │             │ • users      │
│ • CRUD UI   │                   │ • CRUD Routes    │             │ • employees  │
│ • Search    │                   │ • Validation     │             │              │
└─────────────┘                   └──────────────────┘             └──────────────┘
```

## Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** >= 9.x

## Quick Start

### 1. Clone and Setup Database

```bash
# Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE employee_management;"
```

### 2. Start Backend

```bash
cd backend
cp .env.example .env     # Edit .env with your DB credentials
npm install
npm start                # Starts on http://localhost:5000
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev              # Starts on http://localhost:3000
```

---

## Backend Setup

### Environment Variables

Create a `.env` file in `backend/` (copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
```

### Install Dependencies

```bash
cd backend
npm install
```

### Run Database Migrations

```bash
npx sequelize-cli db:migrate
```

### Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server runs on `http://localhost:5000` by default.

---

## Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Start Development Server

```bash
npm run dev
```

The app runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

### Build for Production

```bash
npm run build
```

---

## Docker Setup

### Build and run the backend container:

```bash
cd backend
docker build -t ems-backend .
docker run -p 5000:5000 --env-file .env ems-backend
```

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Authentication

#### Register

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Username already taken."
}
```

#### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid username or password."
}
```

---

### Employees (Protected - requires Bearer token)

> **Note:** All employee endpoints require the `Authorization: Bearer <token>` header.

#### List All Employees

```
GET /api/employees?page=1&limit=10&search=john&status=active&department=Engineering&role=Developer
```

All query parameters are optional.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": 1,
        "name": "Jane Smith",
        "email": "jane@company.com",
        "department": "Engineering",
        "role": "Senior Developer",
        "status": "active",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

#### Get Employee by ID

```
GET /api/employees/1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@company.com",
      "department": "Engineering",
      "role": "Senior Developer",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Employee with ID 1 not found."
}
```

#### Create Employee

```
POST /api/employees
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "department": "Engineering",
  "role": "Senior Developer",
  "status": "active"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Employee created successfully.",
  "data": {
    "employee": {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@company.com",
      "department": "Engineering",
      "role": "Senior Developer",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "A valid email is required." }
  ]
}
```

#### Update Employee

```
PUT /api/employees/1
```

**Request Body (all fields optional):**
```json
{
  "department": "Product",
  "role": "Tech Lead",
  "status": "active"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Employee updated successfully.",
  "data": {
    "employee": {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@company.com",
      "department": "Product",
      "role": "Tech Lead",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-15T00:00:00.000Z"
    }
  }
}
```

#### Delete Employee

```
DELETE /api/employees/1
```

**Response (200):**
```json
{
  "success": true,
  "message": "Employee deleted successfully."
}
```

---

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - Validation errors |
| 401 | Unauthorized - Invalid/missing JWT |
| 403 | Forbidden - Invalid token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |

---

## Database Schema

### Users Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| username | VARCHAR(50) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

### Employees Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| department | VARCHAR(100) | NOT NULL |
| role | VARCHAR(100) | NOT NULL |
| status | ENUM('active','inactive','on_leave') | NOT NULL, DEFAULT 'active' |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

---

## Project Structure

```
employee-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Sequelize DB configuration
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register/Login logic
│   │   │   └── employeeController.js # Employee CRUD logic
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT verification
│   │   │   ├── errorHandler.js       # Global error handler
│   │   │   └── validate.js           # Input validation
│   │   ├── migrations/
│   │   │   ├── 20240101000001-create-users.js
│   │   │   └── 20240101000002-create-employees.js
│   │   ├── models/
│   │   │   ├── index.js              # Sequelize initialization
│   │   │   ├── User.js               # User model
│   │   │   └── Employee.js           # Employee model
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Auth endpoints
│   │   │   └── employeeRoutes.js     # Employee endpoints
│   │   └── server.js                 # Express app entry point
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Env template
│   ├── .sequelizerc                  # Sequelize CLI config
│   ├── Dockerfile                    # Docker image definition
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   └── ProtectedRoute.jsx    # Auth route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # JWT auth state management
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # Login/Register page
│   │   │   ├── EmployeeListPage.jsx  # Employee table + search
│   │   │   ├── EmployeeDetailPage.jsx# Employee profile view
│   │   │   └── EmployeeFormPage.jsx  # Create/Edit employee form
│   │   ├── services/
│   │   │   └── api.js                # Axios API client
│   │   ├── App.jsx                   # Main app with routing
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Testing with Postman

### Setup

1. Import the endpoints into Postman.
2. Create an environment variable `{{BASE_URL}}` = `http://localhost:5000/api`
3. Create a variable `{{TOKEN}}` to store the JWT after login.

### Test Flow

1. **Register a user:**
   ```
   POST {{BASE_URL}}/auth/register
   Body: { "username": "testuser", "password": "password123" }
   ```
   → Save the returned `token` to `{{TOKEN}}`

2. **Login:**
   ```
   POST {{BASE_URL}}/auth/login
   Body: { "username": "testuser", "password": "password123" }
   ```

3. **Create an employee:**
   ```
   POST {{BASE_URL}}/employees
   Headers: Authorization: Bearer {{TOKEN}}
   Body: {
     "name": "Alice Johnson",
     "email": "alice@company.com",
     "department": "Engineering",
     "role": "Frontend Developer",
     "status": "active"
   }
   ```

4. **List employees with search:**
   ```
   GET {{BASE_URL}}/employees?search=alice
   Headers: Authorization: Bearer {{TOKEN}}
   ```

5. **Update employee:**
   ```
   PUT {{BASE_URL}}/employees/1
   Headers: Authorization: Bearer {{TOKEN}}
   Body: { "role": "Senior Frontend Developer" }
   ```

6. **Delete employee:**
   ```
   DELETE {{BASE_URL}}/employees/1
   Headers: Authorization: Bearer {{TOKEN}}
   ```

7. **Test without token (should return 401):**
   ```
   GET {{BASE_URL}}/employees
   ```

---

## Extending the Application

### Add Role-Based Access Control (RBAC)

1. Add a `role` column to the `users` table (`admin`, `manager`, `viewer`).
2. Create an `authorize` middleware:
   ```javascript
   const authorize = (...roles) => (req, res, next) => {
     if (!roles.includes(req.user.role)) {
       return res.status(403).json({ message: 'Insufficient permissions' });
     }
     next();
   };
   ```
3. Apply to routes: `router.delete('/:id', authenticate, authorize('admin'), deleteEmployee)`

### Add Employee Performance Tracking

1. Create a `performance_reviews` table:
   - `id`, `employee_id`, `reviewer_id`, `rating`, `comments`, `review_date`
2. Add a `PerformanceReview` model with associations to `Employee`.
3. Create new routes under `/api/employees/:id/reviews`.

### Add Pagination Improvements

The backend already supports pagination. Extend with:
- Sorting: `?sort=name&order=asc`
- Configurable page sizes

### Add File Uploads (Profile Photos)

1. Install `multer` for file handling.
2. Add a `profile_photo` column to the `employees` table.
3. Create an upload endpoint: `POST /api/employees/:id/photo`
4. Serve static files from an `uploads/` directory.

---

## License

MIT
