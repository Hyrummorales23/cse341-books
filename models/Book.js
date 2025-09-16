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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Format timestamps to be more readable
bookSchema.methods.toJSON = function() {
  const book = this.toObject();
  
  if (book.createdAt) {
    book.createdAt = book.createdAt.toISOString();
  }
  if (book.updatedAt) {
    book.updatedAt = book.updatedAt.toISOString();
  }
  
  return book;
};

module.exports = mongoose.model('Book', bookSchema);