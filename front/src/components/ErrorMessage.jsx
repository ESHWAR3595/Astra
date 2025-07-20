import React from 'react';
import Button from 'react-bootstrap/Button';
import '../styles/components/ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message-container">
      <h4 className="error-message-heading">Oops! Something went wrong</h4>
      <p className="error-message-text">{message}</p>
      {onRetry && (
        <Button 
          variant="outline-danger" 
          onClick={onRetry}
          className="error-message-button"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage; 