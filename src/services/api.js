import axios from 'axios';
import { API_CONFIG, TOKEN_KEY } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('mdb_admin_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  },

  logout: async () => {
    try {
      const response = await api.post('logout');
      
      // Clear local storage regardless of API response
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('mdb_admin_user');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Logout API error:', error);
      
      // Still clear local storage even if API call fails
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('mdb_admin_user');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      return {
        success: true, // Return success since local cleanup is done
        data: { message: 'Logged out successfully (local cleanup)' },
        warning: error.response?.data?.message || 'Logout API call failed, but local session cleared'
      };
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/refresh-token');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to refresh token'
      };
    }
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch stats'
      };
    }
  }
};

// Companies API
export const companiesAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/doamin');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch companies'
      };
    }
  },
  
  deleteByDomain: async (domain) => {
    try {
      const response = await api.delete(`/tenant-by-domain/${domain}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete company'
      };
    }
  },

  statusByDomain: async (domain) => {
    try {
      const response = await api.post(`/tenant-by-domain/${domain}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete company'
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/companies/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch company'
      };
    }
  },

  create: async (companyData) => {
    try {
      const response = await api.post('/companies', companyData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create company'
      };
    }
  },

  update: async (id, companyData) => {
    try {
      const response = await api.put(`/companies/${id}`, companyData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update company'
      };
    }
  }
};

// Plans API
export const plansAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/planList');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch plans'
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/planList/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch plan'
      };
    }
  },

  create: async (planData) => {
    try {
      const response = await api.post('/planList', planData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create plan'
      };
    }
  },

  update: async (id, planData) => {
    try {
      const response = await api.put(`/planList/${id}`, planData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update plan'
      };
    }
  },

  getActive: async () => {
    try {
      const response = await api.get('/planList/active');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch active plans'
      };
    }
  },

  toggleStatus: async (id) => {
    try {
      const response = await api.patch(`/planList/${id}/toggle-status`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to toggle plan status'
      };
    }
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  },

  create: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create user'
      };
    }
  },

  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user'
      };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user'
      };
    }
  }
};

// Analytics API
export const analyticsAPI = {
  getOverview: async () => {
    try {
      const response = await api.get('/analytics/overview');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch analytics overview'
      };
    }
  },

  getCompanyStats: async (companyId) => {
    try {
      const response = await api.get(`/analytics/companies/${companyId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch company analytics'
      };
    }
  },

  getPlanStats: async () => {
    try {
      const response = await api.get('/analytics/plans');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch plan analytics'
      };
    }
  }
};

// Helper function for handling file uploads
export const uploadAPI = {
  uploadFile: async (file, type = 'general') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload file'
      };
    }
  }
};

export default api;