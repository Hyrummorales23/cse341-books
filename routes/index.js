const express = require('express');
const router = express.Router();

// Root route - This will now be the only route under '/'
router.get('/', (req, res) => {
  res.send('Hello from the Books and Authors API! Visit /api-docs for documentation.');
});

module.exports = router;