const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authorsController');
const { authorValidationRules, validateAuthor } = require('../middleware/validation/authorsValidation');

router
  .route('/')
  .get(getAuthors)
  .post(authorValidationRules(), validateAuthor, createAuthor);

router
  .route('/:id')
  .get(getAuthor)
  .put(authorValidationRules(), validateAuthor, updateAuthor)
  .delete(deleteAuthor);

module.exports = router;