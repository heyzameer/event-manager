# Event Management System 📅

A modern, full-stack event management application built with a focus on audit traceability, timezone accuracy, and robust backend architecture.

## 🚀 Key Features
- **Centralized Event Management**: Create, update, and manage events with multiple participants.
- **Audit Logging**: Comprehensive history tracking for all entity changes with precise timestamps.
- **Timezone Intelligence**: Seamless cross-timezone scheduling and display using `dayjs`.
- **Modern UI/UX**: Responsive, accessible, and sleek glassmorphism design with specialized React components.
- **Production Ready Backend**: Rate limiting, security headers (Helmet), input validation (Joi), request traceability (UUID), and log rotation (Winston).
- **Dockerized Environment**: Effortless local setup across platforms using Docker Compose.

---

## 🏗️ Project Structure

### Backend Structure
- `src/app.js`: Application setup and middleware configuration.
- `src/server.js`: Server entry point and database connection logic.
- `src/controllers/`: Handle incoming requests and format responses.
- `src/services/`: Core business logic, orchestration, and service layer.
- `src/repositories/`: Direct database interaction and data access layer (DAL).
- `src/models/`: Mongoose schemas and database models (Event, Profile, AuditLog).
- `src/routes/`: Express router definitions and route grouping.
- `src/middleware/`: Global and route-specific Express middlewares (auth, logging, error handling).
- `src/container/`: Dependency injection and container configuration.
- `src/validators/`: Request body and parameter validation schemas (Joi).
- `src/config/`: App configuration, environment variables, and constants.
- `src/utils/`: Shared utility functions, error classes, and loggers.

### Frontend Structure
- `src/components/`: Reusable React components (EventCard, MultiSelect, Modal, etc.).
- `src/pages/`: Page-level components and high-level routing views.
- `src/services/`: API client configuration and backend integration (Axios).
- `src/store/`: State management logic and context providers.
- `src/config/`: Frontend environment configuration and constants.
- `src/assets/`: Static assets such as images, fonts, and global icons.

---

## 📋 Prerequisites

- **Node.js**: v20.x or higher.
- **MongoDB**: A running local instance or a MongoDB Atlas URI.
- **Docker Desktop**: (Optional) For running the project and its database via Docker.

---

## 🛠 Installation

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Configure your `MONGODB_URI` in `.env`.
5. `npm run dev`

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. `npm run dev`


---

## 🐳 Docker Installation

Run the entire stack (Frontend + Backend + MongoDB) with a single command.

1. **Open your terminal** in the project root.
2. **Run the command**:
   ```bash
   docker-compose up --build
   ```
3. **Access the app**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:5000](http://localhost:5000)

---

## ✨ Code Quality (ESLint)

Standardized code quality with pre-configured **ESLint** (Flat Config) ensuring a clean and consistent codebase.

### Commands
- **Check for issues**: `npm run lint` (run inside the `backend` directory)
- **Auto-fix issues**: `npm run lint:fix`

### Rules Enforced
- 4-space indentation for better readability.
- Single quotes for string consistency.
- Mandatory semicolons.
- Automatic removal of unused variables (unless prefixed with `_`).

---



