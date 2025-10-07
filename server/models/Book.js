const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    match: [/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'Please enter a valid ISBN']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Book price is required'],
    min: [0, 'Price cannot be negative']
  },
  totalCopies: {
    type: Number,
    default: 3,
    min: [1, 'At least 1 copy is required']
  },
  availableCopies: {
    type: Number,
    default: 3,
    min: [0, 'Available copies cannot be negative']
  },
  borrowedCopies: {
    type: Number,
    default: 0,
    min: [0, 'Borrowed copies cannot be negative']
  },
  publicationYear: {
    type: Number,
    required: [true, 'Publication year is required'],
    min: [1000, 'Invalid publication year'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  coverImage: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update available copies when borrowed copies change
bookSchema.pre('save', function(next) {
  this.availableCopies = this.totalCopies - this.borrowedCopies;
  this.updatedAt = Date.now();
  next();
});

// Virtual for checking if book is available
bookSchema.virtual('isAvailable').get(function() {
  return this.availableCopies > 0;
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', genre: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
