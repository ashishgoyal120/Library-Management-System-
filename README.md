# Library Management System

Full-stack Library Management System using:

- Backend: Spring Boot 3, Spring Web, Spring Data JPA, Validation
- Frontend: React, React Router, Axios, Material UI
- Database: Supabase PostgreSQL

The app is configured for local development:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Database: your Supabase project

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+
- A Supabase project with PostgreSQL credentials

## 1. Configure Supabase For Backend

In Supabase, open your new project and go to:

`Connect` -> `Connection string` -> `Transaction pooler`

Copy these values:

- Host
- Port
- Database name, usually `postgres`
- User, usually `postgres.<project-ref>`
- Database password

Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env`:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<supabase-pooler-host>:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.<your-project-ref>
SPRING_DATASOURCE_PASSWORD=<your-database-password>
SPRING_DATASOURCE_PREPARE_THRESHOLD=0

SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_SQL_INIT_MODE=never
APP_LOG_LEVEL=INFO

APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
APP_CORS_ALLOWED_ORIGIN_PATTERNS=
```

Use the pooler port shown by Supabase. It is commonly `6543`, but your Supabase dashboard is the source of truth.

`SPRING_DATASOURCE_PREPARE_THRESHOLD=0` disables PostgreSQL JDBC server-side prepared statements, which avoids `prepared statement already exists` errors when using the Supabase transaction pooler.

## 2. Run Backend Locally

```bash
cd backend
mvn spring-boot:run
```

On first startup, Hibernate creates/updates the required tables in Supabase because `SPRING_JPA_HIBERNATE_DDL_AUTO=update`.

Backend URL:

- `http://localhost:8080`

Useful checks:

- `http://localhost:8080/api/users`
- `http://localhost:8080/api/dashboard/stats`

## 3. Configure Frontend

Create `frontend/.env.local` from `frontend/.env.example`:

```bash
cp frontend/.env.example frontend/.env.local
```

It should contain:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

## 4. Run Frontend Locally

```bash
cd frontend
npm install
npm start
```

Frontend URL:

- `http://localhost:3000`

## Optional Sample Data

`backend/src/main/resources/data.sql` contains PostgreSQL-compatible sample data.

By default it is disabled:

```env
SPRING_SQL_INIT_MODE=never
```

To insert the sample authors, categories, users, and books into a new Supabase database, set this once:

```env
SPRING_SQL_INIT_MODE=always
```

Start the backend, confirm the data appears, then set it back to:

```env
SPRING_SQL_INIT_MODE=never
```

## API Overview

Base URL:

- `http://localhost:8080`

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

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

- Do not commit `backend/.env` or `frontend/.env.local`; they contain local configuration and secrets.
- If you created a new Supabase project, replace all old project-ref, host, username, and password values with the new ones from Supabase.
- The frontend logs in through the local backend; Supabase is used only as the PostgreSQL database.
