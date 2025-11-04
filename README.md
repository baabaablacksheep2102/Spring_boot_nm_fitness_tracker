# Smart Coach - Full Stack Fitness Tracker

A comprehensive fitness tracking application with React frontend and Spring Boot backend, featuring goal setting, workout tracking, meal planning, and progress monitoring.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+
- Node.js 14+
- Maven 3.6+

### 1. Start Database
```bash
docker-compose up -d
```

### 2. Run Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Run Frontend
```bash
npm install
npm start
```

## 📋 Features

- **Authentication**: User registration and login
- **Dashboard**: Daily stats and weekly trends
- **Workout Tracking**: Upload reports with OCR processing
- **Diet Planning**: Log meals and track nutrition
- **Goal Setting**: Set and track fitness objectives
- **Profile Management**: Edit profile and preferences
- **Dark/Light Mode**: Theme toggle with persistence

## 🛠️ Tech Stack

**Frontend:**
- React 18.2.0
- Tailwind CSS
- React Router DOM
- Lucide React Icons

**Backend:**
- Spring Boot 3.1.4
- Spring Data JPA
- PostgreSQL
- Maven

**Infrastructure:**
- Docker Compose
- PostgreSQL 15

## 📊 Database Schema

The application uses PostgreSQL with tables for users, workouts, meals, goals, and preferences. Schema is automatically created on startup.

## 🔧 Configuration

Database connection configured in `backend/src/main/resources/application.properties`:
- URL: `jdbc:postgresql://localhost:5432/smartcoach`
- Username: `smartcoach`
- Password: `smartcoach123`

## 🎯 API Endpoints

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Users**: `/api/users/profile`
- **Workouts**: `/api/workouts/{userId}`
- **Meals**: `/api/meals/{userId}`
- **Goals**: `/api/goals/{userId}`

## 📝 Development

The frontend uses a mock API that can be easily swapped for the real backend by updating imports in `/src/services/apiService.js`.

## 🐳 Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs postgres
```