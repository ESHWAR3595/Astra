// src/components/Login.jsx
import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          // Call the onLogin prop to update the auth state in App.js
          onLogin();
        } else {
          console.error('Login failed');
        }
      })
      .catch((error) => console.error('Error logging in:', error));
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="toggle-link">
        Don't have an account? <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Sign up</a>
      </div>
    </div>
  );
}

export default Login;
