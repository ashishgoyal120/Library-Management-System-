# Library Management System (Spring Boot + React)

This repository contains a full-stack Library Management System.

- Backend: Spring Boot 3.x, Spring Web, Spring Data JPA, Validation, PostgreSQL
- Frontend: React (CRA), React Router, Axios, Material UI, Toast notifications
- Database: Supabase PostgreSQL (for both local and Render)[https://supabase.com/]

## Project Structure

```text
library-management-system/
  backend/
  frontend/
```

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- Supabase project with PostgreSQL credentials

## Backend Configuration (Supabase)

Backend reads DB and CORS config from environment variables.

Reference file:

- `backend/.env.example`
- `backend/.env` (local, ignored by git)

Required env vars:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

Optional env vars:

- `SPRING_JPA_HIBERNATE_DDL_AUTO` (default: `update`)
- `SPRING_JPA_SHOW_SQL` (default: `false`)
- `APP_LOG_LEVEL` (default: `INFO`)
- `APP_CORS_ALLOWED_ORIGINS` (default: `http://localhost:3000`)
- `APP_CORS_ALLOWED_ORIGIN_PATTERNS` (default: `https://*.onrender.com`)

## Running Locally (Supabase DB)

### 1. Set backend env vars

Create `backend/.env` (auto-loaded by Spring Boot) and set:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.your_project_ref
SPRING_DATASOURCE_PASSWORD=your_supabase_password
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
APP_CORS_ALLOWED_ORIGIN_PATTERNS=https://*.onrender.com
```

### 2. Run backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend URL:

- `http://localhost:8080`
- API check URLs:
  - `http://localhost:8080/api/users`
  - `http://localhost:8080/api/dashboard/stats`

Note:

- `http://localhost:8080/` is not a frontend page. Use frontend on port `3000`.

### 3. Configure frontend

Create `frontend/.env.local` and set:

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

### 4. Run frontend

```bash
cd frontend
npm install
npm start
```

Frontend URL:

- `http://localhost:3000`

## Local vs Render Modes

Use one mode at a time:

1. Local mode
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080`
   - DB: Supabase (https://supabase.com/)
2. Render mode (https://dashboard.render.com/login)
   - Frontend: Render static site URL
   - Backend: Render web service URL
   - DB: Supabase (https://supabase.com/)

Do not mix Render frontend with local backend.
Currently I suspended both frontend and backend login to render and resume both app.

## Deploy on Render (Supabase DB)

This repo includes `render.yaml` for a backend web service and frontend static site.

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

## API Overview

Base URL:

- `http://localhost:8080` (local)
- `https://<your-backend>.onrender.com` (Render)

### Auth (`/api/auth`)

- `POST /api/auth/register`
- `POST /api/auth/login`

### Books (`/api/books`)

- `GET /api/books?page=0&size=10`
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

- Backend no longer stores DB credentials in source code.
- Use environment variables for both local and Render.
- CORS must include your active frontend domains.
