## Fullstack Implementation (Java + React + MySQL)

This repository now also includes a complete Notes app implementation:

- Backend: Spring Boot REST API (`backend`)
- Frontend: React + Vite (`frontend`)

### Backend API

Base URL: `http://localhost:8080/api`

Endpoints:

- `POST /notes`
- `GET /notes`
- `GET /notes?userId={id}` (returns only notes created by that user)
- `GET /notes/{id}`
- `PUT /notes/{id}?userId={id}` (owner-only update)
- `DELETE /notes/{id}?userId={id}` (owner-only delete)
- `GET /users`
- `GET /users/{id}`
- `GET /users/{id}/notes`
- `POST /auth/login`
- `POST /auth/register`

Request details:

- `POST /notes` body:
  - `{ "title": "string", "content": "string", "userId": 1 }`
- `PUT /notes/{id}?userId={id}` body:
  - `{ "title": "string", "content": "string" }`
- `POST /auth/login` body:
  - `{ "email": "user@test.com", "password": "secret123" }`
- `POST /auth/register` body:
  - `{ "name": "User Name", "email": "user@test.com", "password": "secret123" }`

### Run Backend

Requirements:

- Java 17+
- Maven 3.9+
- MySQL 8+

Commands:

```bash
cd backend
mvn spring-boot:run
```

Default MySQL connection expected by backend:

- Host: `localhost`
- Port: `3307`
- Database: `notesdb`
- Username: `root`
- Password: `root`

### Run Frontend

Requirements:

- Node.js 18+

Commands:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

### Notes

- The backend now uses MySQL.
- Notes are scoped by logged-in user in the UI.
- Backend enforces note ownership for update/delete.
- Demo seeded users:
  - `admin@test.com` / `123456`
  - `riya@test.com` / `riya123`

### Run With Docker Compose (Recommended)

Requirements:

- Docker + Docker Compose

Command:

```bash
docker compose up --build
```

This starts:

- MySQL: `localhost:3307`
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

---

## Implemented Features Summary

### Core / Stability

- Fixed issues in provided assignment code and delivered a runnable fullstack app.
- Added clear error handling for API failures in frontend.

### Backend (Spring Boot)

- Full Notes CRUD API implemented.
- Authentication endpoints for login/register implemented.
- Ownership checks implemented for note updates and deletes.
- User-scoped note querying supported through `GET /notes?userId={id}`.

### Frontend (React + Vite)

- Login and registration flow integrated with backend.
- Notes dashboard supports create, edit, and delete.
- Added sticky navbar and slide-out drawer navigation.
- Drawer includes quick actions: My Notes, New Note, Logout.
- Logged-in users only see notes they created.
- Added note count indicators in navbar, drawer, and notes section header.

---


