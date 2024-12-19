import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Card from '../components/Card';
import DetailsPage from '../components/DetailsPage';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Hello from '../components/Hello';
import SearchResults from '../components/SearchResults'; // Add SearchResults import

function AppRoutes({ isAuthenticated, onLogin, onLogout }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/hello" replace /> : <Login onLogin={onLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/hello" replace /> : <Login onLogin={onLogin} />} />
      <Route path="/search-results" element={isAuthenticated ? <SearchResults /> : <Navigate to="/login" replace />} />

      {/* Product Details Route */}
      <Route
        path="/view-details/:id"
        element={isAuthenticated ? <DetailsPage /> : <Navigate to="/login" replace />}
      />

      {/* Protected Routes */}
      <Route
        path="/hello"
        element={isAuthenticated ? <Hello onLogout={onLogout} /> : <Navigate to="/login" replace />}
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;