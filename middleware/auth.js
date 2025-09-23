// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    error: 'Authentication required. Please log in.'
  });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    // May add admin role checking here
    return next();
  }
  res.status(401).json({
    success: false,
    error: 'Admin privileges required.'
  });
};

module.exports = {
  isAuthenticated,
  isAdmin
};