// src/App.js
import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Make sure this line is present in your App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

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

  return (
    <div className="App">
      <AppRoutes isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />
    </div>
  );
}

export default App;
