import React, { createContext, useContext, useState, useCallback } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching products from:', buildApiUrl(API_ENDPOINTS.PRODUCTS));
      const response = await fetch(buildApiUrl(API_ENDPOINTS.PRODUCTS));
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success && Array.isArray(data.data)) {
        // Sanitize and transform product data
        const sanitizedProducts = data.data.map(product => {
          const transformedProduct = {
            id: product.id,
            name: product.name || 'Unknown Product',
            description: product.description || 'No description available',
            price: product.price || 0,
            category: product.category || 'Uncategorized',
            imageUrl: (product.imageUrl || product.image_url || '').trim(), // Handle both imageUrl and image_url
            rating: product.rating || 0,
            stock: product.stock || (product.inStock ? 10 : 0), // Convert inStock to stock count
          };
          console.log('Transformed product:', transformedProduct);
          return transformedProduct;
        });
        setProducts(sanitizedProducts);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.SEARCH)}?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Transform search results (now in standard format)
        const transformedResults = data.data.map(item => ({
          id: item.id,
          name: item.name || 'Unknown Product',
          description: item.description || 'No description available',
          price: item.price || 0,
          category: item.category || 'Uncategorized',
          imageUrl: (item.imageUrl || '').trim(),
          rating: item.rating || 0,
          stock: item.stockQuantity || (item.inStock ? 10 : 0),
        }));
        setSearchResults(transformedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Search failed');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get product by ID
  const getProductById = useCallback(async (id) => {
    try {
      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.PRODUCTS)}/${id}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const product = data.data;
        return {
          id: product.id,
          name: product.name || 'Unknown Product',
          description: product.description || 'No description available',
          price: product.price || 0,
          category: product.category || 'Uncategorized',
          imageUrl: (product.imageUrl || product.image_url || '').trim(),
          rating: product.rating || 0,
          stock: product.stock || (product.inStock ? 10 : 0),
        };
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  const value = {
    products,
    searchResults,
    loading,
    error,
    fetchProducts,
    searchProducts,
    getProductById,
    clearSearch,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 