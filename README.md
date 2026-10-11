# JobConnect - Job Portal Website

Starter full-stack project: Java 21, Spring Boot, JDBC, MySQL, React and Vite.

## Requirements
- JDK 21
- MySQL Server and MySQL Workbench
- Node.js LTS and npm
- IntelliJ IDEA and VS Code (recommended)

## 1. Create the database
Open MySQL Workbench and run `database/job_portal.sql`.

## 2. Configure and run backend
Open the `backend` folder as a Maven project in IntelliJ IDEA.
Edit `backend/src/main/resources/application.properties` and set your MySQL username/password. The default username is `root` and the default password is blank. If your root account has a password, set it in the properties file.
Run `JobportalApplication.java`.

- Homepage: http://localhost:8080/
- Jobs API: http://localhost:8080/api/jobs

## 3. Run frontend
Open a terminal in `frontend` and run:
```bash
npm install
npm run dev
```
Open the URL printed by Vite, normally http://localhost:5173.
Keep backend and frontend running in separate terminals.

## API endpoints
- GET `/api/jobs`
- GET `/api/jobs/{id}`
- POST `/api/jobs`
- PUT `/api/jobs/{id}`
- DELETE `/api/jobs/{id}`

This starter implements job CRUD and search. It does not yet include real authentication, applications, resume uploads, or role-based authorization. Do not commit database credentials to GitHub.
