import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Navigation from '../layouts/Navigation';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Container, Alert } from 'react-bootstrap';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query');
  
  const { searchResults, loading, error, searchProducts } = useProducts();

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      navigate('/hello');
    }
  }, [query, searchProducts, navigate]);

  if (!query) {
    return null; // Will redirect to home
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container mt-5 pt-5">
          <LoadingSpinner message="Searching products..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container className="mt-5 pt-5">
        <div className="mb-4">
          <h2>Search Results</h2>
          <p className="text-muted">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        {error && (
          <ErrorMessage message={error} onRetry={() => searchProducts(query)} />
        )}

        {!error && searchResults.length === 0 && (
          <Alert variant="info">
            <Alert.Heading>No products found</Alert.Heading>
            <p>
              We couldn't find any products matching "{query}". Try searching with different keywords.
            </p>
          </Alert>
        )}

        {!error && searchResults.length > 0 && (
          <ProductGrid products={searchResults} />
        )}
      </Container>
    </>
  );
};

export default SearchResultsPage; 