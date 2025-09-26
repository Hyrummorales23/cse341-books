const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  // Safely check if isAuthenticated method exists
  const authStatus = (req.isAuthenticated && req.isAuthenticated()) ? 'Authenticated' : 'Not Authenticated';
  res.send(`Hello from the Books and Authors API! Authentication Status: ${authStatus}. Visit /api-docs for documentation.`);
});

module.exports = router;