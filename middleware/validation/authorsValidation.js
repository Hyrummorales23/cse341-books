const { body, validationResult } = require('express-validator');

// Validation and Sanitization rules for POST/PUT
const authorValidationRules = () => {
  return [
    body('firstName')
      .notEmpty().withMessage('First name is required.')
      .isLength({ max: 100 }).withMessage('First name must be less than 100 chars.')
      .trim().escape(),
    body('lastName')
      .notEmpty().withMessage('Last name is required.')
      .isLength({ max: 100 }).withMessage('Last name must be less than 100 chars.')
      .trim().escape(),
    body('dateOfBirth').optional().isISO8601().toDate(),
    body('dateOfDeath').optional().isISO8601().toDate(),
    body('nationality').optional().trim().escape().isLength({ max: 100 }),
    body('biography').optional().trim().escape().isLength({ max: 1000 }),
    body('website').optional().isURL().withMessage('Must be a valid URL.').isLength({ max: 200 })
  ];
};

// Middleware to check for validation errors
const validateAuthor = (req, res, next) => {
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
  authorValidationRules,
  validateAuthor,
};