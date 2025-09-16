const Author = require('../models/Author');
const asyncHandler = require('express-async-handler'); // To avoid try/catch in every function

// @desc    Get all authors
// @route   GET /api/authors
// @access  Public
const getAuthors = asyncHandler(async (req, res) => {
  const authors = await Author.find().sort({ lastName: 1 });
  res.status(200).json({
    success: true,
    count: authors.length,
    data: authors
  });
});

// @desc    Get single author
// @route   GET /api/authors/:id
// @access  Public
const getAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    // This error will be caught by our errorHandler middleware
    res.status(404);
    throw new Error('Author not found');
  }

  res.status(200).json({
    success: true,
    data: author
  });
});

// @desc    Create new author
// @route   POST /api/authors
// @access  Public (will be private with Auth)
const createAuthor = asyncHandler(async (req, res) => {
  const author = await Author.create(req.body);
  res.status(201).json({
    success: true,
    data: author
  });
});

// @desc    Update author
// @route   PUT /api/authors/:id
// @access  Public (will be private with Auth)
const updateAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true // Run model validators on update
  });

  if (!author) {
    res.status(404);
    throw new Error('Author not found');
  }

  res.status(200).json({
    success: true,
    data: author
  });
});

// @desc    Delete author
// @route   DELETE /api/authors/:id
// @access  Public (will be private with Auth)
const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);

  if (!author) {
    res.status(404);
    throw new Error('Author not found');
  }

  // Check if author has books?
  const books = await Book.find({ author: req.params.id });
   if (books.length > 0) {
     res.status(400);
     throw new Error('This author has books and cannot be deleted.');
   }

  await author.deleteOne();
  res.status(200).json({
    success: true,
    message: `Author '${author.name}' was deleted.`,
    data: {}
  });
});

module.exports = {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};