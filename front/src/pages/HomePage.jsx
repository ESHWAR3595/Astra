import React, { useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import Navigation from '../layouts/Navigation';
import Carouse from '../components/Carouse';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container mt-5 pt-5">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="container mt-5 pt-5">
          <ErrorMessage message={error} onRetry={fetchProducts} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="home-page">
        <Carouse />
        <div className="container mt-4">
          <h2 className="text-center mb-4">Featured Products</h2>
          <ProductGrid products={products} />
        </div>
      </div>
    </>
  );
};

export default HomePage; 