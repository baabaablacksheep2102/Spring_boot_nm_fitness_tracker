// API Service Wrapper
// This is the SINGLE point of contact for all API calls
// When switching to real backend, simply replace the imports in this file

import axios from 'axios';

const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Accept': 'application/json'
  }
});

// Attach token from localStorage to requests automatically
client.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore localStorage errors
  }
  return config;
});

const API = {
  // Auth
  authRegister: (data) => client.post('/auth/register', data).then(r => r.data),
  authLogin: (email, password) => client.post('/auth/login', { email, password }).then(r => r.data),

  // User Profile
  getUserProfile: (userId) => client.get(`/users/${userId}`).then(r => r.data),
  updateUserProfile: (userId, data) => client.post(`/users/${userId}`, data).then(r => r.data),
  uploadProfilePicture: (userId, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return client.post(`/users/${userId}/uploadProfilePicture`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },

  // Preferences (if backend supports)
  getUserPreferences: (userId) => client.get(`/users/${userId}/preferences`).then(r => r.data).catch(() => ({ preferences: {} })),
  updateUserPreferences: (userId, data) => client.post(`/users/${userId}/preferences`, data).then(r => r.data).catch(() => ({ success: false })),

  // Workouts
  uploadWorkout: (userId, file, formData = {}) => {
    const fd = new FormData();
    if (file) fd.append('file', file);
    Object.entries(formData || {}).forEach(([k,v]) => fd.append(k, v));
    return client.post(`/workouts/${userId}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
  getWorkouts: (userId) => client.get(`/workouts/${userId}`).then(r => r.data),
  getWorkoutById: (userId, workoutId) => client.get(`/workouts/${userId}/${workoutId}`).then(r => r.data),
  deleteWorkout: (userId, workoutId) => client.delete(`/workouts/${userId}/${workoutId}`).then(r => r.data),

  // Meals
  logMeal: (userId, mealData) => client.post(`/meals/${userId}`, mealData).then(r => r.data),
  getMeals: (userId, date) => client.get(`/meals/${userId}`, { params: { date } }).then(r => r.data),
  deleteMeal: (userId, mealId) => client.delete(`/meals/${userId}/${mealId}`).then(r => r.data),

  // Dashboard
  getDashboardStats: (userId) => client.get(`/dashboard/${userId}/stats`).then(r => r.data),
  getWeeklyTrends: (userId) => client.get(`/dashboard/${userId}/weekly`).then(r => r.data)
};

export default API;
