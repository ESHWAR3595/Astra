// src/App.js
import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css'; // Make sure this line is present in your App.js
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route location

  useEffect(() => {
    // Check if the user is already logged in
    fetch('http://localhost:5001/check-session', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((error) => console.error('Error checking session:', error));
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true); // Update state when logged in
    navigate('/hello'); // Redirect to hello page after logging in
  };

  const handleLogout = () => {
    fetch('http://localhost:5001/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    })
      .then((response) => {
        if (response.ok) {
          setIsAuthenticated(false); // Update state when logged out
          navigate('/'); // Redirect to login page after logout
        } else {
          console.error('Logout failed');
        }
      })
      .catch((error) => console.error('Error logging out:', error));
  };

  // Conditionally add 'centered' class based on current route
  const isLoginOrSignup = location.pathname === '/' || location.pathname === '/signup';

  return (
    <div className={`App ${isLoginOrSignup ? 'centered' : ''}`}>
      <AppRoutes isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />
    </div>
  );
}

export default App;
