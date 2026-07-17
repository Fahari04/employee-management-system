# Employee Management System

A professional full-stack employee management application built with **React**, **Node.js/Express**, and **SQLite**. The system provides secure authentication, employee CRUD operations, filtering and pagination, and a clean interface for managing employee records.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Docker](#docker)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Testing with Postman](#testing-with-postman)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

The Employee Management System is a full-stack web application for managing employees and user authentication. It includes JWT-based login and registration, protected employee routes, and a responsive React frontend.

## Features

- User registration and login with JWT authentication
- Protected employee management endpoints
- Full CRUD support for employees
- Search, filtering, and pagination
- Form validation and centralized error handling
- Responsive React interface
- SQLite-backed persistence for local development

## Tech Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express
- **Database:** SQLite
- **ORM:** Sequelize
- **Authentication:** JSON Web Tokens (JWT)

## Architecture

```text
React Frontend (Port 3000)
        |
        | HTTP / JSON
        v
Express API (Port 5000)
        |
        | Sequelize
        v
SQLite Database (backend/database.sqlite)
```

## Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm 9+

> PostgreSQL is **not** required for this project in its current configuration.

## Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/Fahari04/employee-management-system.git
cd employee-management-system
```

### 2) Install backend dependencies

```bash
cd backend
npm install
```

### 3) Configure environment variables

Copy the example environment file and update it if needed:

```bash
cp .env.example .env
```

### 4) Run database migrations

```bash
npx sequelize-cli db:migrate
```

### 5) Start the backend

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 6) Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

## Environment Variables

Backend example configuration:

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

> Note: The current codebase uses SQLite in `backend/src/config/database.js`, so the `DB_*` values are not used by the active Sequelize config unless you refactor the database setup.

## API Overview

Base URL:

```text
http://localhost:5000/api
```

### Authentication

- `POST /auth/register`
- `POST /auth/login`

### Employees

All employee routes require a Bearer token.

- `GET /employees`
- `GET /employees/:id`
- `POST /employees`
- `PUT /employees/:id`
- `DELETE /employees/:id`

## Docker

To build and run the backend in Docker:

```bash
cd backend
docker build -t ems-backend .
docker run -p 5000:5000 --env-file .env ems-backend
```

## Project Structure

```text
employee-management-system/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── migrations/
│       ├── models/
│       ├── routes/
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── App.jsx
└── README.md
```

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

## Testing with Postman

1. Import the API endpoints into Postman.
2. Set `{{BASE_URL}}` to `http://localhost:5000/api`.
3. Store the JWT returned from login in `{{TOKEN}}`.
4. Use `Authorization: Bearer {{TOKEN}}` for protected employee routes.

## Future Improvements

- Role-based access control
- Advanced sorting options
- Employee profile photo uploads
- Performance review tracking
- Expanded tests and CI/CD automation

## License

MIT
