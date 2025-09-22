const Book = require('../models/Book');
const Author = require('../models/Author');

// @desc    Get all books
// @route   GET /books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('authorId', 'firstName lastName');
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not retrieve books'
    });
  }
};

// @desc    Get single book
// @route   GET /books/:id
// @access  Public
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('authorId');

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid book ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not retrieve book'
    });
  }
};

// @desc    Create new book
// @route   POST /books
// @access  Public (will be private with Auth)
const createBook = async (req, res) => {
  try {
    // Check if the provided authorId exists
    const authorExists = await Author.findById(req.body.authorId);
    if (!authorExists) {
      return res.status(400).json({
        success: false,
        error: 'The specified Author does not exist.'
      });
    }

    const book = await Book.create(req.body);
    // Populate the author details after creation for the response
    await book.populate('authorId');
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid author ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not create book'
    });
  }
};

// @desc    Update book
// @route   PUT /books/:id
// @access  Public (will be private with Auth)
const updateBook = async (req, res) => {
  try {
    // If authorId is being updated, check if the new author exists
    if (req.body.authorId) {
      const authorExists = await Author.findById(req.body.authorId);
      if (!authorExists) {
        return res.status(400).json({
          success: false,
          error: 'The specified Author does not exist.'
        });
      }
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true // Run model validators on update
    }).populate('authorId');

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid book ID format'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not update book'
    });
  }
};

// @desc    Delete book
// @route   DELETE /books/:id
// @access  Public (will be private with Auth)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    await book.deleteOne();
    res.status(200).json({
      success: true,
      message: `Book '${book.title}' was deleted.`,
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid book ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not delete book'
    });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};