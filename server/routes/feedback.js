const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Feedback = require('../models/Feedback');
const Book = require('../models/Book');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
router.post('/', protect, [
  body('type').isIn(['book', 'library', 'service']).withMessage('Valid feedback type is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('category').isIn(['suggestion', 'complaint', 'compliment', 'question']).withMessage('Valid category is required'),
  body('bookId').optional().isMongoId().withMessage('Valid book ID is required'),
  body('isAnonymous').optional().isBoolean().withMessage('Anonymous must be a boolean'),
  body('isPublic').optional().isBoolean().withMessage('Public must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      type,
      rating,
      title,
      message,
      category,
      bookId,
      isAnonymous = false,
      isPublic = true
    } = req.body;

    // If feedback is for a book, validate book exists
    if (type === 'book' && bookId) {
      const book = await Book.findById(bookId);
      if (!book || !book.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
    }

    // Create feedback
    const feedback = await Feedback.create({
      user: req.user._id,
      book: type === 'book' ? bookId : null,
      type,
      rating,
      title,
      message,
      category,
      isAnonymous,
      isPublic
    });

    // Populate feedback for response
    await feedback.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { feedback }
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all feedback (public)
// @route   GET /api/feedback
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('type').optional().isIn(['book', 'library', 'service']).withMessage('Valid feedback type is required'),
  query('category').optional().isIn(['suggestion', 'complaint', 'compliment', 'question']).withMessage('Valid category is required'),
  query('bookId').optional().isMongoId().withMessage('Valid book ID is required'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter for public feedback only
    const filter = { isPublic: true };

    // Add filters
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.bookId) filter.book = req.query.bookId;
    if (req.query.rating) filter.rating = parseInt(req.query.rating);

    // Get feedback with pagination
    const feedback = await Feedback.find(filter)
      .populate('user', 'name')
      .populate('book', 'title author')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Feedback.countDocuments(filter);

    res.json({
      success: true,
      data: {
        feedback,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalFeedback: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's feedback
// @route   GET /api/feedback/my-feedback
// @access  Private
router.get('/my-feedback', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user's feedback
    const feedback = await Feedback.find({ user: req.user._id })
      .populate('book', 'title author')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Feedback.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        feedback,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalFeedback: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('user', 'name')
      .populate('book', 'title author');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if feedback is public or user is the author
    if (!feedback.isPublic && (!req.user || feedback.user._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { feedback }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
router.put('/:id', protect, [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('message').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('category').optional().isIn(['suggestion', 'complaint', 'compliment', 'question']).withMessage('Valid category is required'),
  body('isPublic').optional().isBoolean().withMessage('Public must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is the author
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own feedback'
      });
    }

    // Update feedback
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('book', 'title author');

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: { feedback: updatedFeedback }
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is the author or admin
    const canDelete = feedback.user.toString() === req.user._id.toString() || 
                     req.user.role === 'admin';

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own feedback'
      });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const publicFeedback = await Feedback.countDocuments({ isPublic: true });
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });

    const typeStats = await Feedback.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryStats = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const ratingStats = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const averageRating = await Feedback.aggregate([
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalFeedback,
        publicFeedback,
        pendingFeedback,
        typeStats,
        categoryStats,
        ratingStats,
        averageRating: averageRating[0]?.average || 0
      }
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
