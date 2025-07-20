// API Configuration - Works locally, containerized, and in production
const API_CONFIG = {
  // Development environment (local)
  development: {
    baseURL: 'http://localhost:5001',
  },
  // Production environment (hosted)
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://astra-production-2955.up.railway.app',
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

if (environment === 'production') {
  // Production environment - use environment variable or fallback
  API_BASE_URL = API_CONFIG.production.baseURL;
} else if (isContainerized) {
  // If containerized, use localhost (frontend container can reach backend via host port)
  API_BASE_URL = 'http://localhost:5001';
} else {
  // If local development, use the environment-specific config
  API_BASE_URL = API_CONFIG[environment]?.baseURL || API_CONFIG.development.baseURL;
}

// Add error handling for API URL
if (!API_BASE_URL) {
  console.error('API_BASE_URL is not defined! Using fallback URL.');
  API_BASE_URL = 'https://astra-production-2955.up.railway.app';
}

console.log('API Configuration:', {
  environment,
  isContainerized,
  API_BASE_URL,
  envVar: process.env.REACT_APP_API_URL
});

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