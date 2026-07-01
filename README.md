# Library Management System

A full-stack Library Management System with a React frontend, Spring Boot backend, and Supabase PostgreSQL database.

## Current Setup

- Frontend: React, React Router, Axios, Material UI
- Backend: Spring Boot 3, Spring Web, Spring Data JPA, Validation
- Database: Supabase PostgreSQL
- Local frontend: `http://localhost:3000`
- Local backend: `http://localhost:8080`
- GitHub Pages frontend: `https://ashishgoyal120.github.io/Library-Management-System-/`

The current deployment uses GitHub Pages for the frontend only. The backend runs locally and connects to Supabase. Render is not required for the current setup.

## Data Model

The app separates login accounts from library members:

- `admin_users`: application users who register and log in to manage the system. Registered users receive the `ADMIN` role.
- `members`: library members/patrons who borrow books. These are managed from the Members screen.

Registration does not create a library member. Members are a separate entity and are created from the Members page.

## Important Architecture Note

GitHub Pages can host only static frontend files. It cannot run the Spring Boot backend.

Current flow:

```text
GitHub Pages React frontend
        -> http://localhost:8080 Spring Boot backend
        -> Supabase PostgreSQL
```

This works on the same computer where the backend is running. Other users cannot access your `localhost:8080`. For public access by other users, the backend must be hosted publicly or the frontend must be rewritten to use Supabase directly.

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+
- npm
- Supabase project with PostgreSQL credentials
- GitHub repository with GitHub Pages enabled through GitHub Actions

## Project Structure

```text
backend/    Spring Boot REST API
frontend/   React frontend
.github/    GitHub Actions workflow for GitHub Pages frontend deployment
```

## Backend Configuration

Create `backend/.env` from the example file:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` with your Supabase database values:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<supabase-pooler-host>:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.<your-project-ref>
SPRING_DATASOURCE_PASSWORD=<your-database-password>
SPRING_DATASOURCE_PREPARE_THRESHOLD=0

SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_SQL_INIT_MODE=never
APP_LOG_LEVEL=INFO
APP_ERRORS_INCLUDE_DETAILS=true

APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,https://ashishgoyal120.github.io
APP_CORS_ALLOWED_ORIGIN_PATTERNS=
```

Use the Supabase transaction pooler values from:

```text
Supabase Dashboard -> Connect -> Connection string -> Transaction pooler
```

`SPRING_DATASOURCE_PREPARE_THRESHOLD=0` avoids PostgreSQL prepared statement issues with the Supabase transaction pooler.

## Run Backend Locally

```bash
cd backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

Useful checks:

```text
http://localhost:8080/api/users
http://localhost:8080/api/dashboard/stats
```

The backend must be running before login, register, books, members, borrow, and dashboard features can work.

On first startup after the model split, Hibernate creates the `admin_users` and `members` tables in Supabase. The old overloaded `users` table is no longer used by the application.

## Frontend Local Configuration

Create `frontend/.env.local` from the example file:

```bash
cp frontend/.env.example frontend/.env.local
```

For local development, use:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Run Frontend Locally

```bash
cd frontend
npm install
npm start
```

Frontend URL:

```text
http://localhost:3000
```

## GitHub Pages Frontend Deployment

The frontend is deployed with GitHub Actions using:

```text
.github/workflows/deploy-frontend.yml
```

The React app is configured with:

```json
"homepage": "https://ashishgoyal120.github.io/Library-Management-System-"
```

The deployed site URL is:

```text
https://ashishgoyal120.github.io/Library-Management-System-/
```

## GitHub Actions Secret

In the GitHub repository, add this repository secret:

```text
Name: REACT_APP_API_BASE_URL
Value: http://localhost:8080
```

Path in GitHub:

```text
Repository -> Settings -> Secrets and variables -> Actions -> New repository secret
```

This value makes the GitHub Pages build call your local backend. It works only when you open the site on the same computer where the backend is running.

## Enable GitHub Pages

In GitHub:

1. Open the repository.
2. Go to `Settings`.
3. Go to `Pages`.
4. Set `Source` to `GitHub Actions`.
5. Go to the `Actions` tab.
6. Run or re-run `Deploy Frontend to GitHub Pages`.

## CORS Setup

Because the deployed frontend runs from:

```text
https://ashishgoyal120.github.io
```

the backend must allow that origin.

Required backend `.env` value:

```env
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,https://ashishgoyal120.github.io
```

After changing `.env`, restart the backend:

```bash
cd backend
mvn spring-boot:run
```

If login shows a browser CORS error, confirm:

- Backend is running on `http://localhost:8080`
- `APP_CORS_ALLOWED_ORIGINS` includes `https://ashishgoyal120.github.io`
- The backend was restarted after changing `.env`
- The GitHub Actions secret `REACT_APP_API_BASE_URL` is set correctly

## Optional Sample Data

`backend/src/main/resources/data.sql` contains PostgreSQL-compatible sample data for authors, categories, one admin user, members, and books.

By default, sample data is disabled:

```env
SPRING_SQL_INIT_MODE=never
```

To load sample data once into a new Supabase database:

```env
SPRING_SQL_INIT_MODE=always
```

Start the backend, confirm the data appears, then set it back to:

```env
SPRING_SQL_INIT_MODE=never
```

## API Overview

Base URL:

```text
http://localhost:8080
```

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Auth endpoints use the `admin_users` table.

Books:

- `GET /api/books?page=0&size=10`
- `GET /api/books/{id}`
- `POST /api/books`
- `PUT /api/books/{id}`
- `DELETE /api/books/{id}`
- `GET /api/books/search?keyword=...&page=0&size=10`
- `GET /api/books/available?page=0&size=10`

Authors:

- `GET /api/authors`
- `GET /api/authors/{id}`
- `POST /api/authors`
- `PUT /api/authors/{id}`
- `DELETE /api/authors/{id}`

Categories:

- `GET /api/categories`
- `GET /api/categories/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

Users/Members:

- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

These endpoints manage library members in the `members` table. The `/api/users` path is kept for API compatibility, but it does not manage admin login accounts.

Borrow/Return:

- `POST /api/borrow/issue`
- `PUT /api/borrow/return/{id}`
- `GET /api/borrow/active`
- `GET /api/borrow/overdue`
- `GET /api/borrow/user/{userId}`
- `GET /api/borrow/book/{bookId}`

Dashboard:

- `GET /api/dashboard/stats`

## Notes

- Do not commit `backend/.env` or `frontend/.env.local`.
- Supabase is used as the PostgreSQL database only.
- The Spring Boot backend contains the REST API and must be running for the app to work.
- GitHub Pages hosts the React frontend only.
- Render deployment has been removed from the current project setup.
- Admin login accounts and library members are stored in separate tables.
