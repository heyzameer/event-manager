# Event Management System 📅

A modern, full-stack event management application built with a focus on audit traceability, timezone accuracy, and robust backend architecture.

## 🚀 Key Features
- **Centralized Event Management**: Create and track events across different profiles.
- **Audit Logging**: Detailed history of changes (title, dates, profiles) with automated "date-only" formatting.
- **Timezone Intelligence**: Seamlessly handle events across different timezones using `dayjs`.
- **Production Ready**: Includes rate limiting, security headers (Helmet), request traceability (UUID), and daily log rotation.

---

## 📋 Prerequisites

### For Manual Setup:
- **Node.js**: v20.x or higher.
- **MongoDB**: A running local instance or a MongoDB Atlas URI.

### For Docker Setup:
- **Docker Desktop**: Installed and running.

---

## 🐳 Installation: The Docker Way (Fastest)

Docker is the recommended way to run this project as it handles the database and environment setup for you.

1.  **Open your terminal** in the project root.
2.  **Run the command**:
    ```bash
    docker-compose up --build
    ```
3.  **Access the app**:
    - Frontend: [http://localhost:5173](http://localhost:5173)
    - Backend: [http://localhost:5000](http://localhost:5000)

---

## 🛠 Installation: The Normal Way

### 1. Backend Setup
1.  `cd backend`
2.  `npm install`
3.  Copy `.env.example` to `.env` and configure your `MONGODB_URI`.
4.  `npm run dev`

### 2. Frontend Setup
1.  `cd frontend`
2.  `npm install`
3.  `npm run dev`

- **Manual Setup**: The "Normal" way using `npm install`.
- **Docker Setup**: The "One Command" way with `docker-compose`.
- **Code Quality**: Pre-configured **ESLint** (Flat Config) to ensure clean, consistent code across the backend.

---

## ✨ Code Quality (ESLint)

I've set up ESLint to keep the code clean and formatted. 

### Commands:
- **Check for issues**: `npm run lint` (in the backend folder)
- **Fix automatic issues**: `npm run lint:fix`

### Rules enforced:
- 4-space indentation.
- Single quotes for strings.
- Mandatory semicolons.
- Automatic removal of unused variables (unless prefixed with `_`).

---


