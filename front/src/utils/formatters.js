// Format price with currency
export const formatPrice = (price, currency = 'USD') => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

// Format product name (capitalize first letter of each word)
export const formatProductName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Unknown Product';
  }
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

// Generate product slug for URLs
export const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Format rating with stars
export const formatRating = (rating) => {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return 0;
  }
  
  return Math.round(rating * 10) / 10; // Round to 1 decimal place
};

// Get stock status
export const getStockStatus = (stock) => {
  if (typeof stock !== 'number' || isNaN(stock)) {
    return { status: 'unknown', text: 'Stock unknown', color: 'secondary' };
  }
  
  if (stock <= 0) {
    return { status: 'out', text: 'Out of Stock', color: 'danger' };
  } else if (stock <= 5) {
    return { status: 'low', text: 'Low Stock', color: 'warning' };
  } else {
    return { status: 'in', text: 'In Stock', color: 'success' };
  }
}; 