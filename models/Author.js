const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 100,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  dateOfDeath: {
    type: Date
  },
  nationality: {
    type: String,
    maxLength: 100
  },
  biography: {
    type: String,
    maxLength: 1000
  },
  website: {
    type: String,
    maxLength: 200
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true }, // Ensure virtuals are included in JSON output
  toObject: { virtuals: true } // Ensure virtuals are included when converting to objects
});

// Virtual for author's full name
authorSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for author's URL
authorSchema.virtual('url').get(function () {
  return `/authors/${this._id}`;
});

// Format date to YYYY-MM-DD without time information
authorSchema.methods.toJSON = function() {
  const author = this.toObject();
  
  if (author.dateOfBirth) {
    author.dateOfBirth = author.dateOfBirth.toISOString().split('T')[0];
  }
  if (author.dateOfDeath) {
    author.dateOfDeath = author.dateOfDeath.toISOString().split('T')[0];
  }
  if (author.createdAt) {
    author.createdAt = author.createdAt.toISOString();
  }
  if (author.updatedAt) {
    author.updatedAt = author.updatedAt.toISOString();
  }
  
  return author;
};

module.exports = mongoose.model('Author', authorSchema);