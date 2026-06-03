<img width="1867" height="1008" alt="Screenshot 2026-06-03 153739" src="https://github.com/user-attachments/assets/50565155-4a07-4ede-ac45-ee5b3f32389a" />
<img width="1545" height="507" alt="Screenshot 2026-06-03 125407" src="https://github.com/user-attachments/assets/31d4477e-4538-45de-95d9-62fe53e1195f" />
# TaskManager — Full Stack Application

A full-stack Task Manager application built with **Spring Boot** (backend) and **Vanilla JavaScript** (frontend), featuring JWT authentication, role-based access control, and Docker containerization.

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.5
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Gradle
- Docker

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Nginx (Docker)

---

## Features

### Authentication
- User registration with BCrypt password hashing
- JWT-based login — stateless authentication
- Admin registration protected by a secret key
- Token expiry handling with automatic redirect to login

### Task Management
- Create, read, update, delete tasks
- Tasks are linked to the logged-in user — complete data isolation
- Filter tasks by status (Pending / Completed)
- Timestamps — createdAt and updatedAt auto-managed

### Admin Panel
- View all registered users
- View all tasks across all users
- Delete users (cascades to their tasks)
- Role-based access — admin routes protected

### API
- RESTful API versioned under `/api/v1/`
- Global exception handling with clean JSON error responses
- Input validation with meaningful error messages
- Swagger UI documentation at `/swagger-ui.html`

---

## Project Structure
taskmanager-fullstack/
├── backend/
│   ├── src/main/java/com/rishi/taskmanager/
│   │   ├── auth/              ← JWT utilities, AuthService, AuthController
│   │   ├── config/            ← SecurityConfig, CorsConfig
│   │   ├── controller/        ← TaskController, UserController
│   │   ├── DTO/               ← Request/Response DTOs
│   │   ├── exception/         ← GlobalExceptionHandler
│   │   ├── model/             ← Task, User entities
│   │   ├── repository/        ← JPA repositories
│   │   └── security/          ← JwtAuthFilter
│   ├── Dockerfile
│   └── docker-compose.yml
└── taskmanager-frontend/
├── index.html             ← Login/Register page
├── dashboard.html         ← User task dashboard
├── admin.html             ← Admin panel
├── css/style.css
├── js/
│   ├── api.js             ← API helper, fetch wrapper
│   ├── auth.js            ← Login/Register logic
│   ├── dashboard.js       ← Task CRUD logic
│   └── admin.js           ← Admin panel logic
└── Dockerfile.frontend---

## Getting Started

### Prerequisites
- Java 17
- PostgreSQL
- Docker Desktop (optional)

### Run locally

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/taskmanager-fullstack.git
```

**2. Setup environment variables**

Create a `.env` file in the `backend` folder:
DB_URL=jdbc:postgresql://localhost:5432/taskdb
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
ADMIN_SECRET=your_admin_secret

**3. Run backend**
```bash
cd backend
./gradlew bootRun
```

**4. Run frontend**

Open `taskmanager-frontend/index.html` with Live Server in VS Code.

---

### Run with Docker

```bash
cd backend
docker-compose up --build
```

- Frontend → http://localhost:80
- Backend → http://localhost:8080
- Swagger → http://localhost:8080/swagger-ui.html

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login and get JWT token |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get own tasks |
| POST | `/api/v1/tasks` | Create task |
| PUT | `/api/v1/tasks/{id}` | Update task |
| DELETE | `/api/v1/tasks/{id}` | Delete task |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | Get all users |
| DELETE | `/api/v1/users/{id}` | Delete user |
| GET | `/api/v1/users/tasks` | Get all tasks |

---

## Security

- Passwords hashed with BCrypt
- JWT tokens signed with HMAC-SHA256
- Stateless authentication — no sessions
- CORS configured for frontend origin
- Environment variables for all secrets — never hardcoded
- Admin routes protected by role-based access control

---

## Screenshots

> Add screenshots of your login page, dashboard, and admin panel here.

---

## Author

**Rishi** — [GitHub](https://github.com/Rishi895-Rathi)
