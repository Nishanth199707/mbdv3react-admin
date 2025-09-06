// utils/auth.js
import { authAPI } from '../services/api';
import { TOKEN_KEY, USER_KEY } from './constants';

/**
 * Centralized logout utility function
 * Handles API call, cleanup, and redirection
 */
export const performLogout = async () => {
  try {
    // Call the logout API
    const result = await authAPI.logout();
    
    if (result.success) {
      console.log('Logout successful');
      if (result.warning) {
        console.warn('Logout warning:', result.warning);
      }
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always perform cleanup regardless of API success/failure
    cleanupAndRedirect();
  }
};

/**
 * Cleanup function for clearing all auth-related data
 */
export const cleanupAndRedirect = () => {
  // Clear all possible auth-related localStorage items
  const keysToRemove = [
    TOKEN_KEY,
    USER_KEY,
    'token',
    'authToken',
    'user',
    'mdb_admin_user',
    'userToken',
    'access_token'
  ];
  
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error);
    }
  });
  
  // Clear session storage as well (if used)
  try {
    sessionStorage.clear();
  } catch (error) {
    console.warn('Failed to clear sessionStorage:', error);
  }
  
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    return !!(token && user);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get current user data from localStorage
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get current auth token
 */
export const getCurrentToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting current token:', error);
    return null;
  }
};