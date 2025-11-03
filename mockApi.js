// Mock API Service
// This centralized service simulates all backend API calls
// When Phase 2 backend is ready, replace these functions with real fetch/axios calls

const API_DELAY = 300; // Simulate network latency (300-800ms)

// Mock Data Store
let mockDataStore = {
  users: {
    1: {
      userId: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      dateOfBirth: '1990-05-15',
      height: 180,
      weight: 75,
      profilePictureUrl: '/media/avatars/default.png'
    }
  },
  workouts: [
    {
      workoutId: 1,
      userId: 1,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      distance: 5.2,
      avgHeartRate: 142,
      calories: 320,
      weatherContext: { temp: 18, humidity: 65 }
    }
  ],
  meals: [
    {
      mealId: 1,
      userId: 1,
      type: 'breakfast',
      date: new Date().toISOString().split('T')[0],
      food: 'Oatmeal with berries',
      calories: 350,
      protein: 10,
      carbs: 50,
      fat: 8
    }
  ],
  preferences: {
    1: { theme: 'light' }
  }
};

// Helper: Simulate network delay and error handling
const simulateDelay = (duration = API_DELAY) => new Promise(resolve => setTimeout(resolve, duration));

// Helper: Generate JWT (mock)
const generateMockJWT = (userId) => `mock.jwt.${userId}.${Date.now()}`;

// ==================== AUTH ENDPOINTS ====================

export const authRegister = async (data) => {
  await simulateDelay();
  
  // Validate
  if (!data.fullName || !data.email || !data.password || !data.dateOfBirth) {
    return { error: 'Missing required fields', status: 400 };
  }

  // Check if email exists
  for (let user of Object.values(mockDataStore.users)) {
    if (user.email === data.email) {
      return { error: 'Email already registered', status: 409 };
    }
  }

  // Create new user
  const userId = Math.max(...Object.keys(mockDataStore.users).map(Number)) + 1;
  const token = generateMockJWT(userId);

  mockDataStore.users[userId] = {
    userId,
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    dateOfBirth: data.dateOfBirth,
    height: data.height || 0,
    weight: data.weight || 0,
    profilePictureUrl: '/media/avatars/default.png'
  };

  mockDataStore.preferences[userId] = { theme: 'light' };

  return {
    token,
    userId,
    user: { userId, fullName: data.fullName, email: data.email },
    status: 201
  };
};

export const authLogin = async (email, password) => {
  await simulateDelay(500);

  const user = Object.values(mockDataStore.users).find(u => u.email === email);

  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  if (user.password !== password) {
    return { error: 'Invalid credentials', status: 401 };
  }

  const token = generateMockJWT(user.userId);

  return {
    token,
    userId: user.userId,
    user: { userId: user.userId, fullName: user.fullName, email: user.email },
    status: 200
  };
};

// ==================== USER PROFILE ENDPOINTS ====================

export const getUserProfile = async (userId) => {
  await simulateDelay();

  const user = mockDataStore.users[userId];
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  return {
    data: {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      height: user.height,
      weight: user.weight,
      profilePictureUrl: user.profilePictureUrl
    },
    status: 200
  };
};

export const updateUserProfile = async (userId, data) => {
  await simulateDelay();

  const user = mockDataStore.users[userId];
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  if (data.fullName) user.fullName = data.fullName;
  if (data.height) user.height = data.height;
  if (data.weight) user.weight = data.weight;

  return {
    data: {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      height: user.height,
      weight: user.weight,
      profilePictureUrl: user.profilePictureUrl
    },
    status: 200
  };
};

export const uploadProfilePicture = async (userId, file) => {
  await simulateDelay(800);

  const user = mockDataStore.users[userId];
  if (!user) {
    return { error: 'User not found', status: 404 };
  }

  // Simulate file upload
  const fileName = `avatar_${userId}_${Date.now()}.png`;
  user.profilePictureUrl = `/media/avatars/${fileName}`;

  return {
    data: { profilePictureUrl: user.profilePictureUrl },
    status: 200
  };
};

// ==================== USER PREFERENCES ====================

export const getUserPreferences = async (userId) => {
  await simulateDelay();

  const prefs = mockDataStore.preferences[userId];
  if (!prefs) {
    return { error: 'Preferences not found', status: 404 };
  }

  return { data: prefs, status: 200 };
};

export const updateUserPreferences = async (userId, data) => {
  await simulateDelay();

  if (!mockDataStore.preferences[userId]) {
    mockDataStore.preferences[userId] = {};
  }

  mockDataStore.preferences[userId] = { ...mockDataStore.preferences[userId], ...data };

  return { data: mockDataStore.preferences[userId], status: 200 };
};

// ==================== WORKOUT ENDPOINTS ====================

export const uploadWorkout = async (userId, file, formData) => {
  await simulateDelay(1200); // Simulate OCR processing

  if (!file) {
    return { error: 'No file provided', status: 400 };
  }

  if (!formData.date || !formData.location) {
    return { error: 'Missing date or location', status: 400 };
  }

  // Simulate OCR extraction
  const workoutId = Math.max(...mockDataStore.workouts.map(w => w.workoutId || 0)) + 1;

  const workout = {
    workoutId,
    userId,
    date: formData.date,
    location: formData.location,
    distance: parseFloat((Math.random() * 10 + 2).toFixed(2)),
    avgHeartRate: Math.floor(Math.random() * 50 + 120),
    calories: Math.floor(Math.random() * 200 + 200),
    weatherContext: {
      temp: Math.floor(Math.random() * 15 + 10),
      humidity: Math.floor(Math.random() * 30 + 50)
    }
  };

  mockDataStore.workouts.push(workout);

  return { data: workout, status: 201 };
};

export const getWorkouts = async (userId) => {
  await simulateDelay();

  const workouts = mockDataStore.workouts.filter(w => w.userId === userId);
  return { data: workouts, status: 200 };
};

export const getWorkoutById = async (userId, workoutId) => {
  await simulateDelay();

  const workout = mockDataStore.workouts.find(w => w.workoutId === parseInt(workoutId) && w.userId === userId);
  if (!workout) {
    return { error: 'Workout not found', status: 404 };
  }

  return { data: workout, status: 200 };
};

export const deleteWorkout = async (userId, workoutId) => {
  await simulateDelay();

  const index = mockDataStore.workouts.findIndex(w => w.workoutId === parseInt(workoutId) && w.userId === userId);
  if (index === -1) {
    return { error: 'Workout not found', status: 404 };
  }

  mockDataStore.workouts.splice(index, 1);
  return { status: 200 };
};

// ==================== DIET/MEALS ENDPOINTS ====================

export const logMeal = async (userId, mealData) => {
  await simulateDelay();

  const mealId = Math.max(...mockDataStore.meals.map(m => m.mealId || 0)) + 1;

  const meal = {
    mealId,
    userId,
    type: mealData.type, // breakfast, lunch, dinner
    date: mealData.date || new Date().toISOString().split('T')[0],
    food: mealData.food,
    calories: mealData.calories || 0,
    protein: mealData.protein || 0,
    carbs: mealData.carbs || 0,
    fat: mealData.fat || 0
  };

  mockDataStore.meals.push(meal);
  return { data: meal, status: 201 };
};

export const getMeals = async (userId, date = null) => {
  await simulateDelay();

  let meals = mockDataStore.meals.filter(m => m.userId === userId);
  if (date) {
    meals = meals.filter(m => m.date === date);
  }

  return { data: meals, status: 200 };
};

export const deleteMeal = async (userId, mealId) => {
  await simulateDelay();

  const index = mockDataStore.meals.findIndex(m => m.mealId === parseInt(mealId) && m.userId === userId);
  if (index === -1) {
    return { error: 'Meal not found', status: 404 };
  }

  mockDataStore.meals.splice(index, 1);
  return { status: 200 };
};

// ==================== DASHBOARD ENDPOINTS ====================

export const getDashboardStats = async (userId) => {
  await simulateDelay();

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = mockDataStore.meals.filter(m => m.userId === userId && m.date === today);
  const todayWorkouts = mockDataStore.workouts.filter(w => w.userId === userId && w.date === today);

  const totalCaloriesIn = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalCaloriesOut = todayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  const steps = todayWorkouts.reduce((sum, w) => sum + Math.floor(w.distance * 1300), 0); // Approx 1300 steps per km

  return {
    data: {
      date: today,
      steps: steps || 0,
      caloriesIn: totalCaloriesIn,
      caloriesOut: totalCaloriesOut,
      netCalories: totalCaloriesIn - totalCaloriesOut,
      workoutCount: todayWorkouts.length,
      mealCount: todayMeals.length
    },
    status: 200
  };
};

export const getWeeklyTrends = async (userId) => {
  await simulateDelay();

  const today = new Date();
  const trends = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayMeals = mockDataStore.meals.filter(m => m.userId === userId && m.date === dateStr);
    const dayWorkouts = mockDataStore.workouts.filter(w => w.userId === userId && w.date === dateStr);

    trends.push({
      date: dateStr,
      caloriesIn: dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
      caloriesOut: dayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0),
      steps: dayWorkouts.reduce((sum, w) => sum + Math.floor(w.distance * 1300), 0)
    });
  }

  return { data: trends, status: 200 };
};

export default {
  authRegister,
  authLogin,
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getUserPreferences,
  updateUserPreferences,
  uploadWorkout,
  getWorkouts,
  getWorkoutById,
  deleteWorkout,
  logMeal,
  getMeals,
  deleteMeal,
  getDashboardStats,
  getWeeklyTrends
};
