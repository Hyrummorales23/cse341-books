const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 200,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  summary: {
    type: String,
    maxLength: 1000
  },
  isbn: {
    type: String,
    maxLength: 20,
    trim: true
  },
  genre: [{
    type: String,
    trim: true
  }],
  publishedYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear()
  },
  pageCount: {
    type: Number,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);