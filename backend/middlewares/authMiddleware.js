const authMiddleware = (req, res, next) => {
    if (req.session.userId) {
      return next(); // Proceed if authenticated
    }
    return res.status(401).json({ error: 'Unauthorized' }); // Respond with 401 if not authenticated
  };
  
  module.exports = authMiddleware;
  