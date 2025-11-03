# Smart Coach Backend API Specification

## Overview

This document defines the complete API contract that the Spring Boot backend must implement for the Smart Coach wellness platform. The frontend is built in React with a mock API architecture that will seamlessly integrate with these endpoints in Phase 2.

**Base URL:** `http://localhost:8080/api/v1`

All endpoints require proper CORS configuration to allow requests from the frontend domain.

---

## Authentication & Authorization

### Token Format
- JWT tokens are used for authentication
- Tokens must be passed in the `Authorization` header: `Authorization: Bearer {token}`
- Tokens should expire after 24 hours

### Error Responses
All endpoints return appropriate HTTP status codes:
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Server Error

---

## Endpoints

### AUTH Endpoints

#### POST /api/v1/auth/register

Register a new user account.

**Request Body:**
``json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123",
  "dateOfBirth": "1995-03-15",
  "height": 170,
  "weight": 65
}
``

**Success Response (201):**
``json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 123,
  "user": {
    "userId": 123,
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  }
}
``

**Error Responses:**
- `400` - Missing required fields
- `409` - Email already registered

---

#### POST /api/v1/auth/login

Authenticate a user and return a JWT token.

**Request Body:**
``json
{
  "email": "jane@example.com",
  "password": "securePassword123"
}
``

**Success Response (200):**
``json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 123,
  "user": {
    "userId": 123,
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  }
}
``

**Error Responses:**
- `401` - Invalid email or password

---

### USER PROFILE Endpoints

#### GET /api/v1/users/profile

Get the authenticated user''s profile information.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
``json
{
  "userId": 123,
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "dateOfBirth": "1995-03-15",
  "height": 170,
  "weight": 65,
  "profilePictureUrl": "/media/avatars/user_123.png"
}
``

**Error Responses:**
- `401` - Unauthorized
- `404` - User not found

---

#### PUT /api/v1/users/profile

Update the authenticated user''s profile information.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
``json
{
  "fullName": "Jane Doe Updated",
  "height": 172,
  "weight": 63,
  "dateOfBirth": "1995-03-15"
}
``

**Success Response (200):**
``json
{
  "userId": 123,
  "fullName": "Jane Doe Updated",
  "email": "jane@example.com",
  "dateOfBirth": "1995-03-15",
  "height": 172,
  "weight": 63,
  "profilePictureUrl": "/media/avatars/user_123.png"
}
``

**Error Responses:**
- `400` - Invalid data
- `401` - Unauthorized

---

#### POST /api/v1/users/profile/picture

Upload a new profile picture (supports jpg, png, gif).

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request:**
- Form data with file field named `file` (max 5MB)

**Success Response (200):**
``json
{
  "profilePictureUrl": "/media/avatars/user_123_new_uuid.png"
}
``

**Error Responses:**
- `400` - Invalid file format or size exceeds 5MB
- `401` - Unauthorized

---

### USER PREFERENCES Endpoints

#### GET /api/v1/users/preferences

Get the authenticated user''s preferences.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
``json
{
  "theme": "dark"
}
``

**Error Responses:**
- `401` - Unauthorized

---

#### PUT /api/v1/users/preferences

Update the authenticated user''s preferences.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
``json
{
  "theme": "light"
}
``

**Success Response (200):**
``json
{
  "theme": "light"
}
``

**Error Responses:**
- `400` - Invalid preference values
- `401` - Unauthorized

---

### WORKOUT Endpoints

#### POST /api/v1/workouts/upload

Upload a workout report (file-based OCR ingestion).

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request:**
- File field: `file` (PDF or image, max 10MB)
- Data field: `data` (JSON string)

**Data Field Format:**
``json
{
  "date": "2025-11-04",
  "location": "New York"
}
``

**Success Response (201):**
``json
{
  "workoutId": 789,
  "date": "2025-11-04",
  "distance": 5.12,
  "avgHeartRate": 145,
  "calories": 310,
  "location": "New York",
  "weatherContext": {
    "temp": 15,
    "humidity": 60
  }
}
``

**Error Responses:**
- `400` - Could not parse text from image, invalid date format, or missing required fields
- `401` - Unauthorized

**Implementation Notes:**
- Extract text from PDF/image using OCR (Tesseract recommended)
- Parse workout metrics from extracted text
- Call weather API to get temperature & humidity for the location and date
- Simulate OCR processing delay of 2-5 seconds before returning

---

#### GET /api/v1/workouts

Get all workouts for the authenticated user.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
``json
[
  {
    "workoutId": 789,
    "date": "2025-11-04",
    "distance": 5.12,
    "avgHeartRate": 145,
    "calories": 310,
    "location": "New York",
    "weatherContext": {
      "temp": 15,
      "humidity": 60
    }
  }
]
``

**Error Responses:**
- `401` - Unauthorized

---

#### GET /api/v1/workouts/{workoutId}

Get a specific workout by ID.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
``json
{
  "workoutId": 789,
  "date": "2025-11-04",
  "distance": 5.12,
  "avgHeartRate": 145,
  "calories": 310,
  "location": "New York",
  "weatherContext": {
    "temp": 15,
    "humidity": 60
  }
}
``

**Error Responses:**
- `401` - Unauthorized
- `404` - Workout not found

---

#### DELETE /api/v1/workouts/{workoutId}

Delete a specific workout.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
``json
{
  "message": "Workout deleted successfully"
}
``

**Error Responses:**
- `401` - Unauthorized
- `404` - Workout not found

---

#### GET /api/v1/workouts/stats/weekly

Get weekly workout statistics for the dashboard.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
``json
[
  {
    "day": "Monday",
    "date": "2025-11-03",
    "distance": 5.2,
    "calories": 310
  },
  {
    "day": "Tuesday",
    "date": "2025-11-04",
    "distance": 0,
    "calories": 0
  }
]
``

**Error Responses:**
- `401` - Unauthorized

---

#### GET /api/v1/workouts/stats/today

Get today''s workout summary for the dashboard.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
``json
{
  "steps": 8500,
  "caloriesBurned": 450,
  "caloriesConsumed": 2100
}
``

**Error Responses:**
- `401` - Unauthorized

---

### DIET/MEAL ENDPOINTS

#### GET /api/v1/meals

Get all meals for a specific date.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `date` (required) - Format: `YYYY-MM-DD`

**Success Response (200):**
``json
[
  {
    "mealId": 1,
    "type": "breakfast",
    "food": "Oatmeal with berries",
    "date": "2025-11-04",
    "calories": 350,
    "protein": 10,
    "carbs": 50,
    "fat": 8
  },
  {
    "mealId": 2,
    "type": "lunch",
    "food": "Grilled chicken with rice",
    "date": "2025-11-04",
    "calories": 650,
    "protein": 45,
    "carbs": 60,
    "fat": 12
  }
]
``

**Error Responses:**
- `401` - Unauthorized
- `400` - Invalid date format

---

#### POST /api/v1/meals

Log a new meal for the authenticated user.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
``json
{
  "type": "breakfast",
  "food": "Pancakes with maple syrup",
  "date": "2025-11-04",
  "calories": 500,
  "protein": 12,
  "carbs": 70,
  "fat": 15
}
``

**Success Response (201):**
``json
{
  "mealId": 3,
  "type": "breakfast",
  "food": "Pancakes with maple syrup",
  "date": "2025-11-04",
  "calories": 500,
  "protein": 12,
  "carbs": 70,
  "fat": 15
}
``

**Error Responses:**
- `400` - Invalid meal type or missing required fields (valid types: breakfast, lunch, dinner)
- `401` - Unauthorized

---

#### DELETE /api/v1/meals/{mealId}

Delete a specific meal.

**Headers:** `Authorization: Bearer {token}`

**Success Response (200):**
``json
{
  "message": "Meal deleted successfully"
}
``

**Error Responses:**
- `401` - Unauthorized
- `404` - Meal not found

---

## Database Schema Requirements

### Users Table
``sql
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(500) NOT NULL,
  date_of_birth DATE,
  height INT,
  weight INT,
  profile_picture_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
``

### Workouts Table
``sql
CREATE TABLE workouts (
  workout_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  distance DECIMAL(10, 2),
  avg_heart_rate INT,
  calories INT,
  location VARCHAR(255),
  weather_temp INT,
  weather_humidity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
``

### Meals Table
``sql
CREATE TABLE meals (
  meal_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM(''breakfast'', ''lunch'', ''dinner'') NOT NULL,
  food VARCHAR(500) NOT NULL,
  date DATE NOT NULL,
  calories INT,
  protein DECIMAL(10, 2),
  carbs DECIMAL(10, 2),
  fat DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
``

### User Preferences Table
``sql
CREATE TABLE user_preferences (
  preference_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  theme ENUM(''light'', ''dark'') DEFAULT ''light'',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
``

---

## Implementation Notes for Backend Team

### Security Best Practices
1. **Password Storage**: Use bcrypt with salt (minimum 10 rounds) for password hashing
2. **JWT Tokens**: Sign with a strong secret key (minimum 32 characters) and set expiration to 24 hours
3. **CORS**: Configure CORS to allow requests from the frontend domain
4. **Input Validation**: Validate and sanitize all inputs on the backend
5. **HTTPS**: All endpoints must use HTTPS in production

### External Services Integration
1. **OCR Processing**: 
   - Use Apache Tika or Tesseract for PDF/image text extraction
   - Extract workout metrics (distance, heart rate, calories) from OCR text
   - Return appropriate error if text cannot be parsed

2. **Weather API**:
   - Integrate with a weather service (OpenWeatherMap, WeatherAPI, etc.)
   - For each workout location and date, fetch weather data
   - Cache weather data to avoid excessive API calls

### File Upload Handling
1. **Profile Pictures**:
   - Accept: JPG, PNG, GIF (max 5MB)
   - Store in `/media/avatars/` with UUID filename
   - Return relative URL for frontend to display

2. **Workout Files**:
   - Accept: PDF, JPG, PNG (max 10MB)
   - Temporarily store file during OCR processing
   - Delete after processing (unless archiving required)

### Data Persistence
- All meal and workout data must be persisted to the database
- Implement proper foreign key relationships
- Ensure user isolation (users can only access their own data)
- Timestamp all database records

---

## Phase 2 Integration

The frontend is designed with a mock API layer that will seamlessly swap to real backend calls:

1. Frontend currently uses `/src/services/apiService.js` as the single API gateway
2. In Phase 2, simply create `/src/services/realApi.js` with the same function signatures
3. Update `apiService.js` to import from `realApi.js` instead of `mockApi.js`
4. **Zero component changes required** - the entire UI continues to work

Example integration:
``javascript
// Current (mockApi.js)
export const authLogin = async (email, password) => { ... }

// Phase 2 (realApi.js)
export const authLogin = async (email, password) => {
  const response = await fetch(''http://localhost:8080/api/v1/auth/login'', {
    method: ''POST'',
    headers: { ''Content-Type'': ''application/json'' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

// In apiService.js, simply change the import
import * as API from ''./realApi.js''; // Was: ''./mockApi.js''
``

---

## Testing Recommendations

1. **Unit Tests**: Test all endpoint logic independently
2. **Integration Tests**: Test with actual database
3. **Security Tests**: Test authentication, authorization, input validation
4. **Load Tests**: Ensure system handles typical user load
5. **Frontend Integration Tests**: Test with React frontend to verify contract compliance

---

## Support & Questions

For clarifications on specific endpoints or requirements, refer to the mock API implementation in `/src/services/mockApi.js` which contains all simulated behavior and edge cases.
