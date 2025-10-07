const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const Group = require('../models/Group');
const Feedback = require('../models/Feedback');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Create admin account (for initial setup)
// @route   POST /api/admin/create-admin
// @access  Public (for initial setup only)
router.post('/create-admin', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('address').notEmpty().withMessage('Address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists'
      });
    }

    // Create admin user
    const admin = new User({
      name,
      email,
      password,
      phone,
      address,
      role: 'admin'
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// All other admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });
    const usersWithFines = await User.countDocuments({ totalFines: { $gt: 0 } });

    // Get book statistics
    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalCopies = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$totalCopies' } } }
    ]);
    const availableCopies = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$availableCopies' } } }
    ]);

    // Get borrowing statistics
    const totalBorrows = await BorrowRecord.countDocuments();
    const activeBorrows = await BorrowRecord.countDocuments({ status: { $in: ['borrowed', 'overdue'] } });
    const overdueBorrows = await BorrowRecord.countDocuments({ status: 'overdue' });
    const totalFines = await BorrowRecord.aggregate([
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);

    // Get group statistics
    const totalGroups = await Group.countDocuments({ isActive: true });
    const activeGroupBorrows = await BorrowRecord.countDocuments({ 
      group: { $exists: true }, 
      status: { $in: ['borrowed', 'overdue'] } 
    });

    // Get feedback statistics
    const totalFeedback = await Feedback.countDocuments();
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });

    // Get recent activity
    const recentBorrows = await BorrowRecord.find()
      .populate('borrower', 'name email')
      .populate('book', 'title author')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentFeedback = await Feedback.find()
      .populate('user', 'name email')
      .populate('book', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          withFines: usersWithFines
        },
        books: {
          total: totalBooks,
          totalCopies: totalCopies[0]?.total || 0,
          availableCopies: availableCopies[0]?.total || 0
        },
        borrowing: {
          total: totalBorrows,
          active: activeBorrows,
          overdue: overdueBorrows,
          totalFines: totalFines[0]?.total || 0
        },
        groups: {
          total: totalGroups,
          activeBorrows: activeGroupBorrows
        },
        feedback: {
          total: totalFeedback,
          pending: pendingFeedback
        },
        recentActivity: {
          borrows: recentBorrows,
          feedback: recentFeedback
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('role').optional().isIn(['user', 'admin']).withMessage('Valid role is required'),
  query('hasFines').optional().isBoolean().withMessage('Has fines must be a boolean')
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

    // Build filter
    const filter = { isActive: true };

    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') }
      ];
    }

    // Role filter
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Fines filter
    if (req.query.hasFines === 'true') {
      filter.totalFines = { $gt: 0 };
    } else if (req.query.hasFines === 'false') {
      filter.totalFines = 0;
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all borrow records
// @route   GET /api/admin/borrow-records
// @access  Private (Admin only)
router.get('/borrow-records', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['borrowed', 'returned', 'overdue', 'lost', 'damaged']).withMessage('Valid status is required'),
  query('userId').optional().isMongoId().withMessage('Valid user ID is required'),
  query('bookId').optional().isMongoId().withMessage('Valid book ID is required')
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

    // Build filter
    const filter = {};

    // Add filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.userId) filter.borrower = req.query.userId;
    if (req.query.bookId) filter.book = req.query.bookId;

    // Get borrow records with pagination
    const borrowRecords = await BorrowRecord.find(filter)
      .populate('borrower', 'name email phone')
      .populate('book', 'title author isbn')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await BorrowRecord.countDocuments(filter);

    res.json({
      success: true,
      data: {
        borrowRecords,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get borrow records error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all groups
// @route   GET /api/admin/groups
// @access  Private (Admin only)
router.get('/groups', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
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

    // Get groups with pagination
    const groups = await Group.find({ isActive: true })
      .populate('members', 'name email phone totalFines')
      .populate('leader', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Group.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        groups,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalGroups: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Private (Admin only)
router.get('/feedback', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'reviewed', 'resolved', 'dismissed']).withMessage('Valid status is required'),
  query('type').optional().isIn(['book', 'library', 'service']).withMessage('Valid feedback type is required')
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

    // Build filter
    const filter = {};

    // Add filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    // Get feedback with pagination
    const feedback = await Feedback.find(filter)
      .populate('user', 'name email')
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

// @desc    Update feedback status
// @route   PUT /api/admin/feedback/:id/status
// @access  Private (Admin only)
router.put('/feedback/:id/status', [
  body('status').isIn(['pending', 'reviewed', 'resolved', 'dismissed']).withMessage('Valid status is required'),
  body('adminResponse').optional().trim().isLength({ max: 500 }).withMessage('Admin response cannot exceed 500 characters')
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

    const { status, adminResponse } = req.body;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Update feedback
    feedback.status = status;
    if (adminResponse) {
      feedback.adminResponse = adminResponse;
      feedback.adminResponseDate = new Date();
    }
    await feedback.save();

    // Populate feedback for response
    await feedback.populate([
      { path: 'user', select: 'name email' },
      { path: 'book', select: 'title author' }
    ]);

    res.json({
      success: true,
      message: 'Feedback status updated successfully',
      data: { feedback }
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put('/users/:id/status', [
  body('isActive').isBoolean().withMessage('Active status must be a boolean')
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

    const { isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deactivating the last admin
    if (!isActive && user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last admin user'
        });
      }
    }

    // Update user status
    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user: { id: user._id, name: user.name, email: user.email, isActive: user.isActive } }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create admin user
// @route   POST /api/admin/create-admin
// @access  Private (Admin only)
router.post('/create-admin', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('address').trim().isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters')
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

    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create admin user
    const adminUser = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          phone: adminUser.phone,
          address: adminUser.address,
          role: adminUser.role
        }
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
