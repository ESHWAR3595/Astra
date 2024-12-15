// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Card from '../components/Card';
import DetailsPage from '../components/DetailsPage';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Hello from '../components/Hello';

function AppRoutes({ isAuthenticated, onLogin, onLogout }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Card />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      
      {/* Product Details Route */}
      <Route path="/details/:id" element={<DetailsPage />} /> {/* Correct product details route */}

      {/* Protected Routes */}
      <Route path="/hello" element={isAuthenticated ? <Hello onLogout={onLogout} /> : <Navigate to="/login" replace />} />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
