## Library Management System (Spring Boot + React)

This repository contains a **fully functional Library Management System**:

- **Backend**: Spring Boot 3.x, Spring Web, Spring Data JPA, MySQL, Validation, Lombok
- **Frontend**: React (CRA), Axios, React Router, Material UI, Toast notifications

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL running locally

Database connection (as requested):

- **Host**: `127.0.0.1`
- **Port**: `3306`
- **User**: `root`
- **Password**: `1234`
- **Database**: `rahulshettyacademy`

Make sure the database exists:

```sql
CREATE DATABASE IF NOT EXISTS rahulshettyacademy;
```

## Project Structure

```text
library-management-system/
  backend/
  frontend/
```

## Running the Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

- JPA is configured with `spring.jpa.hibernate.ddl-auto=update`, so tables will be auto-created.
- Optional sample data is loaded from `src/main/resources/data.sql`.

## Running the Frontend (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.

## API Overview

Base URL: `http://localhost:8080`

### Auth (`/api/auth`)

- `POST /api/auth/register`
- `POST /api/auth/login`

### Books (`/api/books`)

- `GET /api/books?page=0&size=10` (pagination)
- `GET /api/books/{id}`
- `POST /api/books`
- `PUT /api/books/{id}`
- `DELETE /api/books/{id}`
- `GET /api/books/search?keyword=...&page=0&size=10`
- `GET /api/books/available?page=0&size=10`

### Authors (`/api/authors`)

- `GET /api/authors`
- `GET /api/authors/{id}`
- `POST /api/authors`
- `PUT /api/authors/{id}`
- `DELETE /api/authors/{id}`

### Categories (`/api/categories`)

- `GET /api/categories`
- `GET /api/categories/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Users/Members (`/api/users`)

- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

### Borrow/Return (`/api/borrow`)

- `POST /api/borrow/issue`
- `PUT /api/borrow/return/{id}`
- `GET /api/borrow/active`
- `GET /api/borrow/overdue`
- `GET /api/borrow/user/{userId}`
- `GET /api/borrow/book/{bookId}`

### Dashboard (`/api/dashboard`)

- `GET /api/dashboard/stats`

## Notes

- CORS is configured to allow `http://localhost:3000`.
- Validation errors and not-found errors are returned as structured JSON responses.

## Deploy In Render and Supabase

### PHASE 1 - Setup Database (Supabase)

#### Step 1 - Create Project on Supabase

1. Go to `https://supabase.com`
2. Login using GitHub
3. Click New Project
4. Fill:
   - Name: `library-db`
   - Database password -> Save this carefully
   - Region -> Choose closest to India
5. Click Create Project
6. Wait 2-3 minutes

#### Step 2 - Get Database Credentials

Go to:

- Connect -> Connection String -> Change method from "Direct Connection" to "Transaction Pooler"

Expand "view Parameters" dropdown and note:

- Host
- Port (5432)
- Database name
- User
- Password

Keep this open.

### PHASE 2 - Update Spring Boot For PostgreSQL

Go to:

- `backend/src/main/resources/application.properties`

#### Step 3 - Update pom.xml

Open:

- `backend/pom.xml`

Remove MySQL dependency.

Add:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

Save.

#### Step 4 - Test Backend Locally

Run:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

If successful:

- Tables will auto-create in Supabase
- No DB error
- Confirm this works before moving ahead.

### PHASE 3 - Deploy Backend to Render

#### Step 5 - Push Code to GitHub

```bash
git add .
git commit -m "PostgreSQL setup"
git push
```

#### Step 6 - Deploy Backend on Render

Go to `https://dashboard.render.com/login`

New -> Web Service

Git Provier -> connect only library project -> Connect GitHub

Select your repo

Fill:

- Name: `Library-Management-System-Backend`
- language : Docker
- Region : any but I selected oregon
- Root Directory: `backend`
- Dockerfile Path : keep it blank but make sure Docker file must be in same level of pom.xml
- Environment Variables:
  - `SPRING_DATASOURCE_PASSWORD` : `<Password generated in Supabase>`
  - `SPRING_DATASOURCE_URL` : `jdbc:postgresql://aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require`
  - `SPRING_DATASOURCE_USERNAME` : `postgres.kmbpamsquralquekljyv`

Click Deploy

Wait 5-10 min.

You'll get:

- `https://your-backend-name.onrender.com`

If it loads -> Backend done.

### PHASE 4 - Deploy Frontend

#### Step 8 - Update API URL

In React code replace:

- `http://localhost:8080`

With:

- `https://your-backend-name.onrender.com`

Commit & push again.

#### Step 9 - Deploy Frontend on Render

Create:

- New -> Static Site
- git Provider -> Only your library project

Fill:

- Name : `Library-Management-System-Frontend`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Environment :
  - `REACT_APP_API_BASE_URL` : `<URL of Render Backend>`

Redirect and Rewrite Rules:

- Source : `/*`
- Destination : `/index.html`
- Action: Rewrite

Deploy
