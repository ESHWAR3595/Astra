import { useState, useCallback } from 'react';

export const useImageLoader = () => {
  const [imageErrors, setImageErrors] = useState(new Set());

  // Generate fallback SVG for product images
  const getFallbackImage = useCallback((productName) => {
    const initials = productName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return `data:image/svg+xml;base64,${btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#f8f9fa"/>
        <text x="100" y="100" font-family="Arial, sans-serif" font-size="24" 
              text-anchor="middle" dy=".3em" fill="#6c757d">${initials}</text>
      </svg>
    `)}`;
  }, []);

  // Validate image URL
  const isValidImageUrl = useCallback((url) => {
    if (!url || typeof url !== 'string') return false;
    
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  // Handle image loading error
  const handleImageError = useCallback((e, productName) => {
    const imageKey = `${productName}-${e.target.src}`;
    
    // Prevent infinite loop by checking if we're already using a fallback
    if (!e.target.src.includes('data:image/svg+xml')) {
      e.target.src = getFallbackImage(productName);
      e.target.alt = `${productName} - Image not available`;
      
      // Track this error to prevent repeated processing
      setImageErrors(prev => new Set(prev).add(imageKey));
    }
  }, [getFallbackImage]);

  return {
    getFallbackImage,
    isValidImageUrl,
    handleImageError,
    imageErrors,
  };
}; 