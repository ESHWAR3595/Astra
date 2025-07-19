// API Configuration - Works both locally and with containers
const API_CONFIG = {
  // Development environment (local)
  development: {
    baseURL: 'http://localhost:5001',
  },
  // Production environment (containerized)
  production: {
    baseURL: 'http://localhost:5001', // For containerized frontend
  },
  // Docker environment (containerized)
  docker: {
    baseURL: 'http://localhost:5001', // For containerized frontend
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Check if we're running in a container or locally
const isContainerized = process.env.REACT_APP_CONTAINERIZED === 'true' || 
                       window.location.hostname !== 'localhost';

// Determine the correct base URL
let API_BASE_URL;

if (isContainerized) {
  // If containerized, use localhost (frontend container can reach backend via host port)
  API_BASE_URL = 'http://localhost:5001';
} else {
  // If local development, use the environment-specific config
  API_BASE_URL = API_CONFIG[environment]?.baseURL || API_CONFIG.development.baseURL;
}

// Export the appropriate configuration
export { API_BASE_URL };

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