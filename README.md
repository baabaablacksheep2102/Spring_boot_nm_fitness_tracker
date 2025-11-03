# Smart Coach - Frontend React Application

A fully responsive, high-fidelity web application for the Smart Coach wellness platform. This is a frontend-first build with a mock API architecture designed for seamless Phase 2 integration with a Spring Boot backend.

## 📋 Project Overview

The Smart Coach platform provides users with:

- **Authentication**: Sign up, login, and profile management
- **Dashboard**: Personalized welcome, daily stats, and weekly trends
- **Workout Tracking**: Upload workout reports with simulated OCR processing
- **Diet Planning**: Log meals and track macronutrients
- **User Preferences**: Dark/Light mode toggle with persistent storage
- **Profile Management**: Edit profile details and upload profile pictures

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Lucide React 0.292.0
- **State Management**: React Context API
- **HTTP Client**: Axios 1.6.0

## 📁 Project Structure

``
smart-coach/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation bar with dark mode toggle
│   │   └── Disclaimer.js      # Legal disclaimer banner
│   ├── contexts/
│   │   ├── AuthContext.js     # Authentication state management
│   │   └── ThemeContext.js    # Dark/Light mode state management
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── SignUpPage.js
│   │   ├── DashboardPage.js
│   │   ├── ProfilePage.js
│   │   ├── WorkoutUploadPage.js
│   │   ├── WorkoutSummaryPage.js
│   │   └── DietPlannerPage.js
│   ├── services/
│   │   ├── mockApi.js         # Mock API implementation
│   │   └── apiService.js      # API service wrapper (single point of contact)
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── BACKEND_API_SPEC.md        # API contract for backend team
└── README.md
``

## 🚀 Getting Started

### Prerequisites
- Node.js 14.0 or higher
- npm 6.0 or higher

### Installation

1. **Clone or download the repository**
   ``bash
   cd smart-coach
   ``

2. **Install dependencies**
   ``bash
   npm install
   ``

3. **Start the development server**
   ``bash
   npm start
   ``

   The application will open in your browser at `http://localhost:3000`

### Build for Production

``bash
npm run build
``

This creates an optimized production build in the `build/` directory.

## 🔐 Authentication

The app uses mock JWT authentication for development:

**Demo Credentials:**
- Email: `john@example.com`
- Password: `password123`

**Or sign up with new credentials**

Mock JWT tokens are stored in `localStorage` under the key `token`.

## 🎨 Features

### 1. Authentication Flow
- User registration with validation
- Login with mock JWT token generation
- Protected routes (redirect to login if not authenticated)
- Auto-logout on token expiration

### 2. Dashboard
- Personalized welcome message
- Today''s stats (steps, calories burned, calories consumed)
- Weekly trend chart showing distance and calories
- Quick links to other features

### 3. Profile Management
- View and edit profile information (name, height, weight, DOB)
- Profile picture upload with preview
- Changes persist in mock data store

### 4. Workout Tracking
- Upload workout reports (PDF or image)
- Simulated OCR processing (2-5 second delay)
- Displays workout summary: distance, heart rate, calories, weather
- Delete workouts
- Mock weather context data

### 5. Diet Planner
- Log meals by type (breakfast, lunch, dinner)
- Track calories and macronutrients (protein, carbs, fat)
- View daily summary
- Delete meals
- Date-based filtering

### 6. Theme Toggle
- Dark/Light mode switch in navbar
- User preference persisted in localStorage
- Tailwind dark mode implementation

## 🔄 API Architecture

The mock API is implemented as a centralized service layer:

**Single Point of Contact:** `/src/services/apiService.js`
- Exports a unified `API` object with all endpoint functions
- Currently imports from `mockApi.js`

**Mock Implementation:** `/src/services/mockApi.js`
- Implements all API endpoints with realistic behavior
- Simulates network delays (300-1200ms)
- Provides error handling and validation
- Maintains data persistence (mocked in memory)

### API Endpoints Implemented

**Authentication:**
- `POST /auth/register` - Create new user
- `POST /auth/login` - Authenticate user

**User Profile:**
- `GET /users/profile` - Get profile info
- `PUT /users/profile` - Update profile
- `POST /users/profile/picture` - Upload profile picture

**User Preferences:**
- `GET /users/preferences` - Get theme preference
- `PUT /users/preferences` - Update theme preference

**Workouts:**
- `POST /workouts/upload` - Upload workout report
- `GET /workouts` - Get all workouts
- `GET /workouts/{id}` - Get specific workout
- `DELETE /workouts/{id}` - Delete workout
- `GET /workouts/stats/weekly` - Get weekly stats
- `GET /workouts/stats/today` - Get today''s stats

**Meals:**
- `GET /meals?date=YYYY-MM-DD` - Get meals for date
- `POST /meals` - Log new meal
- `DELETE /meals/{id}` - Delete meal

## 🔄 Phase 2 Backend Integration

The mock API architecture enables seamless Phase 2 integration:

### Step 1: Create Real API Service
Create `/src/services/realApi.js` with identical function signatures:

``javascript
export const authLogin = async (email, password) => {
  const response = await fetch(''http://localhost:8080/api/v1/auth/login'', {
    method: ''POST'',
    headers: { ''Content-Type'': ''application/json'' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return {
    token: data.token,
    userId: data.userId,
    user: data.user,
    status: response.status,
    error: !response.ok ? data.error : null
  };
};
``

### Step 2: Update Import
In `/src/services/apiService.js`, change:
``javascript
// From:
import * as mockAPI from ''./mockApi'';
export const API = mockAPI;

// To:
import * as realAPI from ''./realApi'';
export const API = realAPI;
``

### Step 3: Done!
**Zero component changes required** - entire frontend continues working with real backend.

## 📚 Backend API Specification

See `BACKEND_API_SPEC.md` for the complete API contract that the Spring Boot backend must implement.

Key sections:
- All endpoint definitions with request/response formats
- Required database schema (SQL included)
- Implementation notes (security, file uploads, OCR, weather API)
- Error handling standards
- Phase 2 integration guide

## 🧪 Testing the Mock API

The mock API includes:

1. **Email Validation**: Try registering with an existing email (john@example.com)
2. **Login Errors**: Try wrong password or non-existent email
3. **File Upload**: Upload workout images (simulated OCR)
4. **Data Persistence**: Add meals, refresh page, verify meals still there
5. **Theme Persistence**: Toggle dark mode, refresh page, mode persists

## 🔒 Security Notes

This is a **development frontend**. For production:

1. Use HTTPS
2. Implement proper JWT validation
3. Add CSRF protection
4. Sanitize all user inputs
5. Use secure HTTP-only cookies for tokens
6. Implement proper session management

## 🐛 Known Limitations

- Mock API stores data in memory (resets on page refresh)
- No real OCR processing (simulated with delays)
- Weather data is mocked
- No real file storage (profile pictures are mocked)
- All validation is client-side only

## 📝 Environment Variables

Currently, the app uses localhost defaults:

``
REACT_APP_API_URL=http://localhost:8080/api/v1
``

For future customization, update the `API_DELAY` constant in `mockApi.js`.

## 🚦 Available Scripts

- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (one-way operation)

## 📖 Further Reading

- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router Docs](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## 📞 Support

For questions about the frontend architecture or mock API, refer to:
- `/src/services/mockApi.js` - Implementation details
- `BACKEND_API_SPEC.md` - API contract

For backend integration questions, see the Phase 2 section in this README or in BACKEND_API_SPEC.md.

## 📄 License

This project is developed for the Smart Coach wellness platform.
