// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'http://localhost:5001',
  },
  // Production environment
  production: {
    baseURL: 'http://host.docker.internal:5001',
  },
  // Docker environment
  docker: {
    baseURL: 'http://host.docker.internal:5001',
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_BASE_URL = API_CONFIG[environment]?.baseURL || API_CONFIG.development.baseURL;

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/login',
  SIGNUP: '/register', // Changed from /register to match backend
  LOGOUT: '/logout',
  CHECK_SESSION: '/check-session',
  PRODUCTS: '/api/products',
  SEARCH: '/api/search',
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`; 