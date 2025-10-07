const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: null // null for general library feedback
  },
  type: {
    type: String,
    enum: ['book', 'library', 'service'],
    required: [true, 'Feedback type is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Feedback title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Feedback message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['suggestion', 'complaint', 'compliment', 'question'],
    required: [true, 'Category is required']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    maxlength: [500, 'Admin response cannot exceed 500 characters']
  },
  adminResponseDate: {
    type: Date,
    default: null
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
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

// Update book's average rating when feedback is created/updated
feedbackSchema.post('save', async function() {
  if (this.type === 'book' && this.book) {
    await this.constructor.updateBookRating(this.book);
  }
});

// Static method to update book rating
feedbackSchema.statics.updateBookRating = async function(bookId) {
  const Book = mongoose.model('Book');
  
  const feedbacks = await this.find({ book: bookId, type: 'book' });
  
  if (feedbacks.length > 0) {
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;
    
    await Book.findByIdAndUpdate(bookId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: feedbacks.length
    });
  }
};

// Update updatedAt field before saving
feedbackSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
feedbackSchema.index({ user: 1, type: 1 });
feedbackSchema.index({ book: 1, type: 1 });
feedbackSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
