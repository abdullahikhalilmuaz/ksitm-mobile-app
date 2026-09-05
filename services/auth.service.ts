import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Register
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  // Logout
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // Check if logged in
  isLoggedIn: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};