import React from 'react';
import '../Hello.css'; // Updated CSS file

function Hello({ onLogout }) {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="container">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <span className="navbar-brand">My App</span>
          <a href="#dashboard" className="navbar-link">Dashboard</a>
          <a href="#settings" className="navbar-link">Settings</a>
          <a href="#profile" className="navbar-link">Profile</a>
        </div>
        <div className="navbar-center">
          <input type="text" className="search-bar" placeholder="Search..." />
          <button className="search-button">Search</button>
        </div>
        <div className="navbar-right">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <h1>Welcome to Hello Page!</h1>
        <p>Feel free to explore the navbar and use the search functionality.</p>
      </div>
    </div>
  );
}

export default Hello;
