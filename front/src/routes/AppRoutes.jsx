import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import LoadingSpinner from '../components/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return isAuthenticated ? <Navigate to="/hello" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/hello" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/search-results" element={
        <ProtectedRoute>
          <SearchResultsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/view-details/:id" element={
        <ProtectedRoute>
          <ProductDetailsPage />
        </ProtectedRoute>
      } />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;