// src/App.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { buildApiUrl, API_ENDPOINTS } from './config/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch session data on mount to check authentication status
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(buildApiUrl(API_ENDPOINTS.CHECK_SESSION), {
          credentials: 'include',
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated || false); // Update authentication state
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false); // Assume unauthenticated on error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkSession();
  }, []);

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/hello'); // Redirect to protected page
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.LOGOUT), {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Check if the current route is for login, signup, or public pages
  const isPublicPage = ['/', '/signup', '/login'].includes(location.pathname);

  // Display loading state while checking session
  if (loading) {
    return <div className="App loading">Checking session...</div>;
  }

  return (
    <div className={`App ${isPublicPage ? 'centered' : ''}`}>
      <AppRoutes 
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
    </div>
  );
}

export default App;
