// Application constants
export const APP_NAME = 'ASTRA';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 3;

// Product constants
export const PRODUCTS_PER_PAGE = 12;
export const MAX_PRODUCT_NAME_LENGTH = 100;
export const MAX_PRODUCT_DESCRIPTION_LENGTH = 500;

// Search constants
export const MIN_SEARCH_LENGTH = 2;
export const MAX_SEARCH_LENGTH = 100;
export const SEARCH_DEBOUNCE_MS = 300;

// Image constants
export const DEFAULT_IMAGE_WIDTH = 200;
export const DEFAULT_IMAGE_HEIGHT = 200;
export const IMAGE_QUALITY = 0.8;

// Stock status thresholds
export const LOW_STOCK_THRESHOLD = 5;
export const OUT_OF_STOCK_THRESHOLD = 0;

// Rating constants
export const MAX_RATING = 5;
export const MIN_RATING = 0;

// Price constants
export const DEFAULT_CURRENCY = 'USD';
export const MIN_PRICE = 0;
export const MAX_PRICE = 999999.99;

// Form validation
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'astra_user_preferences',
  SEARCH_HISTORY: 'astra_search_history',
  CART_ITEMS: 'astra_cart_items',
  WISHLIST: 'astra_wishlist',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  LOGIN_FAILED: 'Invalid email or password.',
  SIGNUP_FAILED: 'Failed to create account. Please try again.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  SEARCH_FAILED: 'Search failed. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PRODUCT_ADDED_TO_CART: 'Product added to cart!',
  PRODUCT_ADDED_TO_WISHLIST: 'Product added to wishlist!',
};

// Route paths
export const ROUTES = {
  HOME: '/hello',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SEARCH_RESULTS: '/search-results',
  PRODUCT_DETAILS: '/view-details',
  CART: '/cart',
  WISHLIST: '/wishlist',
  PROFILE: '/profile',
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  XS: 576,
  SM: 768,
  MD: 992,
  LG: 1200,
  XL: 1400,
};

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
}; 