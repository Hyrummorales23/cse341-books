const { body, validationResult } = require('express-validator');

// Validation and Sanitization rules for POST/PUT
const bookValidationRules = () => {
  return [
    body('title')
      .notEmpty().withMessage('Title is required.')
      .isLength({ max: 200 }).withMessage('Title must be less than 200 characters.')
      .trim().escape(),
    body('authorId')
      .notEmpty().withMessage('Author ID is required.')
      .isMongoId().withMessage('Must be a valid Author ID.'),
    body('summary').optional().trim().escape().isLength({ max: 1000 }),
    body('isbn').optional().trim().escape().isLength({ max: 20 }),
    body('genre.*').optional().trim().escape(), // Validates each item in the genre array
    body('publishedYear')
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage(`Published year must be between 1000 and ${new Date().getFullYear()}.`),
    body('pageCount')
      .optional()
      .isInt({ min: 1 }).withMessage('Page count must be a positive integer.')
  ];
};

// Middleware to check for validation errors
const validateBook = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // Extract error messages
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  // Return validation error response
  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  bookValidationRules,
  validateBook,
};