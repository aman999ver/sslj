import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Set up axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    // Check if this is an admin route
    const isAdminRoute = config.url && config.url.startsWith('/api/admin');
    
    if (isAdminRoute) {
      // For admin routes, use adminToken only
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      // For other routes, try adminToken first, then clientToken
      const adminToken = localStorage.getItem('adminToken');
      const clientToken = localStorage.getItem('clientToken');
      const token = adminToken || clientToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log('Request config:', {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
      isAdminRoute
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('clientToken');
      
      // Redirect based on current path
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Admin authentication functions
export const adminAuth = {
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return { isAuthenticated: false };
      }

      const response = await axios.get('/api/auth/me');
      if (response.data.success) {
        return { isAuthenticated: true, user: response.data.user };
      }
      return { isAuthenticated: false };
    } catch (error) {
      localStorage.removeItem('adminToken');
      return { isAuthenticated: false };
    }
  },

  getToken: () => {
    return localStorage.getItem('adminToken');
  }
};

// Client authentication functions
export const clientAuth = {
  login: async (credentials) => {
    try {
      const response = await axios.post('/api/client/login', credentials);
      if (response.data.success) {
        localStorage.setItem('clientToken', response.data.token);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post('/api/client/register', userData);
      if (response.data.success) {
        localStorage.setItem('clientToken', response.data.token);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('clientToken');
    window.location.href = '/login';
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('clientToken');
      if (!token) {
        return { isAuthenticated: false };
      }

      const response = await axios.get('/api/client/me');
      if (response.data.success) {
        return { isAuthenticated: true, user: response.data.user };
      }
      return { isAuthenticated: false };
    } catch (error) {
      localStorage.removeItem('clientToken');
      return { isAuthenticated: false };
    }
  },

  getToken: () => {
    return localStorage.getItem('clientToken');
  }
};

// Protected route component wrapper
export const withAuth = (Component, authType = 'client') => {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const checkAuth = async () => {
        const auth = authType === 'admin' ? adminAuth : clientAuth;
        const result = await auth.checkAuth();
        
        setIsAuthenticated(result.isAuthenticated);
        setUser(result.user);
        setLoading(false);
        
        if (!result.isAuthenticated) {
          const loginPath = authType === 'admin' ? '/admin/login' : '/login';
          window.location.href = loginPath;
        }
      };

      checkAuth();
    }, [authType]);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} user={user} />;
  };
};

export default axios; 