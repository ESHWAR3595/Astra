// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.details = err.message;
    return res.status(400).json(error);
  }

  if (err.name === 'UnauthorizedError') {
    error.message = 'Unauthorized';
    return res.status(401).json(error);
  }

  if (err.code === '23505') { // PostgreSQL unique constraint violation
    error.message = 'Duplicate entry';
    return res.status(409).json(error);
  }

  // Default 500 error
  res.status(500).json(error);
};

module.exports = errorHandler; 