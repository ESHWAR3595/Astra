// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Hello from '../components/Hello';

function AppRoutes({ isAuthenticated, onLogin, onLogout }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/hello" replace /> : <Login onLogin={onLogin} />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/hello" replace /> : <Signup />} />
      
      {/* Protected Route */}
      <Route path="/hello" element={isAuthenticated ? <Hello onLogout={onLogout} /> : <Navigate to="/" replace />} />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
