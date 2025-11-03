// API Service Wrapper
// This is the SINGLE point of contact for all API calls
// When switching to real backend, simply replace the imports in this file

import * as mockApi from './mockApi';

// For Phase 2: Replace mockApi with real API calls
// import * as realApi from './realApi';
// export * from './realApi';

export const API = {
  // Auth
  authRegister: (data) => mockApi.authRegister(data),
  authLogin: (email, password) => mockApi.authLogin(email, password),

  // User Profile
  getUserProfile: (userId) => mockApi.getUserProfile(userId),
  updateUserProfile: (userId, data) => mockApi.updateUserProfile(userId, data),
  uploadProfilePicture: (userId, file) => mockApi.uploadProfilePicture(userId, file),

  // Preferences
  getUserPreferences: (userId) => mockApi.getUserPreferences(userId),
  updateUserPreferences: (userId, data) => mockApi.updateUserPreferences(userId, data),

  // Workouts
  uploadWorkout: (userId, file, formData) => mockApi.uploadWorkout(userId, file, formData),
  getWorkouts: (userId) => mockApi.getWorkouts(userId),
  getWorkoutById: (userId, workoutId) => mockApi.getWorkoutById(userId, workoutId),
  deleteWorkout: (userId, workoutId) => mockApi.deleteWorkout(userId, workoutId),

  // Meals
  logMeal: (userId, mealData) => mockApi.logMeal(userId, mealData),
  getMeals: (userId, date) => mockApi.getMeals(userId, date),
  deleteMeal: (userId, mealId) => mockApi.deleteMeal(userId, mealId),

  // Dashboard
  getDashboardStats: (userId) => mockApi.getDashboardStats(userId),
  getWeeklyTrends: (userId) => mockApi.getWeeklyTrends(userId)
};

export default API;
