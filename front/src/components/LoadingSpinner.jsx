import React from 'react';
import '../styles/components/LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium', variant = 'primary' }) => {
  const getSpinnerClass = () => {
    let classes = 'loading-spinner';
    if (size === 'large') classes += ' loading-spinner-large';
    if (size === 'small') classes += ' loading-spinner-small';
    if (variant === 'success') classes += ' loading-spinner-success';
    if (variant === 'warning') classes += ' loading-spinner-warning';
    if (variant === 'danger') classes += ' loading-spinner-danger';
    return classes;
  };

  return (
    <div className="loading-spinner-container">
      <div className={getSpinnerClass()} role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="loading-spinner-text">
        {message}
        <span className="loading-dots"></span>
      </p>
    </div>
  );
};

export default LoadingSpinner; 