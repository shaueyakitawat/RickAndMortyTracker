import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual API endpoint
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token logic would go here
        // For now just logout
        await AsyncStorage.removeItem('userToken');
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Auth endpoints
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  
  // Habits endpoints
  getHabits: () => apiClient.get('/habits'),
  getHabitById: (id) => apiClient.get(`/habits/${id}`),
  createHabit: (habitData) => apiClient.post('/habits', habitData),
  updateHabit: (id, habitData) => apiClient.put(`/habits/${id}`, habitData),
  deleteHabit: (id) => apiClient.delete(`/habits/${id}`),
  
  // User profile
  getUserProfile: () => apiClient.get('/user/profile'),
  updateUserProfile: (profileData) => apiClient.put('/user/profile', profileData),
  
  // Stats and analytics
  getStats: (timeframe = 'week') => apiClient.get(`/stats?timeframe=${timeframe}`),
};

export default apiService; 