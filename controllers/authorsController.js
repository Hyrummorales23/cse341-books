const Author = require('../models/Author');
const Book = require('../models/Book');

// @desc    Get all authors
// @route   GET /authors
// @access  Public
const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ lastName: 1 });
    res.status(200).json({
      success: true,
      count: authors.length,
      data: authors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not retrieve authors'
    });
  }
};

// @desc    Get single author
// @route   GET /authors/:id
// @access  Public
const getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }

    res.status(200).json({
      success: true,
      data: author
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid author ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not retrieve author'
    });
  }
};

// @desc    Create new author
// @route   POST /authors
// @access  Public (will be private with Auth)
const createAuthor = async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({
      success: true,
      data: author
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not create author'
    });
  }
};

// @desc    Update author
// @route   PUT /authors/:id
// @access  Public (will be private with Auth)
const updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true // Run model validators on update
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }

    res.status(200).json({
      success: true,
      data: author
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid author ID format'
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
      error: 'Server Error: Could not update author'
    });
  }
};

// @desc    Delete author
// @route   DELETE /authors/:id
// @access  Public (will be private with Auth)
const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found'
      });
    }

    // Check if author has books (prevent deletion if they do)
    const books = await Book.find({ authorId: req.params.id });
    if (books.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'This author has books and cannot be deleted. Delete their books first.'
      });
    }

    await author.deleteOne();
    res.status(200).json({
      success: true,
      message: `Author '${author.name}' was deleted.`,
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid author ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not delete author'
    });
  }
};

module.exports = {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};