import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setCompanies(parsedUser.companies || []);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear invalid data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authAPI.login(credentials);
      
      if (result.success) {
        const { token, user_type, data } = result.data;
        
        const userData = {
          userType: user_type,
          companies: data || [],
          email: credentials.email,
          loginTime: new Date().toISOString(),
          name: result.data.name || result.data.username || 'Super Admin'
        };
        
        // Store in localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        setCompanies(data || []);
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (skipAPI = false) => {
    try {
      // Only call API if not explicitly skipped and user is authenticated
      if (!skipAPI && user) {
        setLoading(true);
        
        // Call the logout API
        const result = await authAPI.logout();
        
        if (result.success) {
          console.log('Logout API call successful');
          if (result.warning) {
            console.warn('Logout warning:', result.warning);
          }
        } else {
          console.error('Logout API call failed:', result.error);
          // Continue with local cleanup anyway
        }
      }
    } catch (error) {
      console.error('Error during logout API call:', error);
      // Continue with local cleanup anyway
    } finally {
      // Always clear local state and storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('mdb_admin_user'); // Clear any additional stored data
      
      setUser(null);
      setCompanies([]);
      setLoading(false);
      
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  const updateUser = (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const updateCompanies = (companiesData) => {
    try {
      setCompanies(companiesData);
      const updatedUser = { ...user, companies: companiesData };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating companies:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      // You can add an API call here to refresh user data if needed
      // const result = await authAPI.getUserProfile();
      // if (result.success) {
      //   updateUser(result.data);
      // }
      checkAuthStatus();
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    companies,
    login,
    logout,
    updateUser,
    updateCompanies,
    refreshUserData,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};