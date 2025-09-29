const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  // Properly check authentication
  let authStatus = 'Not Authenticated';
  let userInfo = '';
  
  if (req.isAuthenticated && req.isAuthenticated()) {
    authStatus = 'Authenticated';
    if (req.user && req.user.displayName) {
      userInfo = ` as ${req.user.displayName}`;
    }
  }

  res.send(`Hello from the Books and Authors API! Authentication Status: ${authStatus}${userInfo}. Visit /api-docs for documentation.`);
});

module.exports = router;