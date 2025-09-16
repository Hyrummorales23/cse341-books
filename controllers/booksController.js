const Book = require('../models/Book');
const Author = require('../models/Author');
const asyncHandler = require('express-async-handler');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate('authorId', 'firstName lastName'); // Populate author name only
  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('authorId');

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.status(200).json({
    success: true,
    data: book
  });
});

// @desc    Create new book
// @route   POST /api/books
// @access  Public (will be private with Auth)
const createBook = asyncHandler(async (req, res) => {
  // Check if the provided authorId exists
  const authorExists = await Author.findById(req.body.authorId);
  if (!authorExists) {
    res.status(400);
    throw new Error('The specified Author does not exist.');
  }

  const book = await Book.create(req.body);
  // Populate the author details after creation for the response
  await book.populate('authorId');
  res.status(201).json({
    success: true,
    data: book
  });
});

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Public (will be private with Auth)
const updateBook = asyncHandler(async (req, res) => {
  // If authorId is being updated, check if the new author exists
  if (req.body.authorId) {
    const authorExists = await Author.findById(req.body.authorId);
    if (!authorExists) {
      res.status(400);
      throw new Error('The specified Author does not exist.');
    }
  }

  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true // Run model validators on update
  }).populate('authorId');

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.status(200).json({
    success: true,
    data: book
  });
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public (will be private with Auth)
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: `Book '${book.title}' was deleted.`,
    data: {}
  });
});

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};