# Employee Leave Management System (ELMS)

A web-based Employee Leave Management System built using React.js, Spring Boot, Spring Security, JWT Authentication, and MySQL.

## Project Overview

The Employee Leave Management System (ELMS) simplifies employee leave management by providing separate portals for employees and managers.

Employees can apply for leave, track their leave requests, and view their leave balances. Managers can manage employee records and approve or reject leave applications.

## Key Features

### Employee
- Employee registration and login
- JWT-based authentication
- Employee dashboard
- Apply for casual, sick, and earned leave
- View leave application history
- Track leave approval status
- View available leave balance

### Manager
- Manager login
- Manager dashboard
- View pending leave requests
- Approve or reject leave applications
- Add, view, update, and delete employee records

### Security
- Password encryption using BCrypt
- JWT authentication
- Role-based authorization
- Protected frontend routes
- Backend API access control

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Backend | Java 17, Spring Boot |
| Security | Spring Security, JWT |
| Database | MySQL 8 |
| ORM | Spring Data JPA, Hibernate |
| API | REST API |
| Testing | Postman, Maven |
| Version Control | Git, GitHub |

## Project Structure

```text
Employee-Leave-Management-System/
│
├── elms-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/elms_backend/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       └── application.example.properties
│   │   └── test/
│   └── pom.xml
│
├── elms-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── postman/
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Java JDK 17
- Node.js and npm
- MySQL 8
- Git

## Database Setup

1. Start MySQL Server.
2. Create the database:

```sql
CREATE DATABASE elms_db;
```

3. Navigate to:

`elms-backend/src/main/resources/`

4. Copy `application.example.properties` and create a file named `application.properties`.
5. Configure your database credentials and JWT secret using environment variables.

Example PowerShell configuration:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/elms_db"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:JWT_SECRET="your_base64_encoded_secret"
```

Use a randomly generated Base64-encoded JWT secret containing at least 32 random bytes.

## Running the Backend

Open a terminal:

```powershell
cd elms-backend
.\mvnw.cmd spring-boot:run
```

Backend URL:

`http://localhost:8080`

## Running the Frontend

Open another terminal:

```powershell
cd elms-frontend
npm install
npm run dev
```

Frontend URL:

`http://localhost:5173`

## Application Modules

1. Authentication and Authorization
2. Employee Management
3. Leave Application Management
4. Leave Approval and Rejection
5. Leave Balance Management

## Testing

- Backend tests using Maven
- REST API testing using Postman
- Frontend production build using Vite

## Future Enhancements

- Email notifications for leave approvals
- Leave calendar and holiday management
- Advanced reports and analytics
- Deployment to a cloud platform

## Author

Developed as a Building Enterprise Applications (BEA) academic project.

## License

This project is developed for academic and educational purposes.