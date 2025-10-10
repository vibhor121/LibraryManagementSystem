const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const BorrowRecord = require('../models/BorrowRecord');
const Group = require('../models/Group');
const { protect, isOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Search users for group invitations
 * @route   GET /api/users/search
 * @access  Private
 */
router.get('/search', protect, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    const users = await User.find({
      _id: { $ne: req.user._id }, // Exclude current user
      isActive: true,
      $or: [
        { name: searchRegex },
        { email: searchRegex }
      ]
    })
    .select('name email phone')
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('borrowedBooks');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's borrowing statistics
// @route   GET /api/users/:id/stats
// @access  Private
router.get('/:id/stats', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Get borrowing statistics
    const totalBorrows = await BorrowRecord.countDocuments({ borrower: userId });
    const currentBorrows = await BorrowRecord.countDocuments({ 
      borrower: userId, 
      status: { $in: ['borrowed', 'overdue'] } 
    });
    const overdueBorrows = await BorrowRecord.countDocuments({ 
      borrower: userId, 
      status: 'overdue' 
    });
    const returnedBorrows = await BorrowRecord.countDocuments({ 
      borrower: userId, 
      status: 'returned' 
    });

    // Get fine statistics
    const totalFines = await BorrowRecord.aggregate([
      { $match: { borrower: userId } },
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);

    const unpaidFines = await BorrowRecord.aggregate([
      { $match: { borrower: userId, isFinePaid: false, fine: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);

    // Get group statistics
    const userGroup = await Group.findOne({ 
      members: userId, 
      isActive: true 
    }).populate('members', 'name email');

    // Get recent borrowing activity
    const recentBorrows = await BorrowRecord.find({ borrower: userId })
      .populate('book', 'title author isbn')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        borrowing: {
          total: totalBorrows,
          current: currentBorrows,
          overdue: overdueBorrows,
          returned: returnedBorrows
        },
        fines: {
          total: totalFines[0]?.total || 0,
          unpaid: unpaidFines[0]?.total || 0
        },
        group: userGroup,
        recentActivity: recentBorrows
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's current borrowings
// @route   GET /api/users/:id/current-borrows
// @access  Private
router.get('/:id/current-borrows', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const currentBorrows = await BorrowRecord.find({ 
      borrower: userId, 
      status: { $in: ['borrowed', 'overdue'] } 
    })
      .populate('book', 'title author isbn coverImage')
      .populate('group', 'name')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: { currentBorrows }
    });
  } catch (error) {
    console.error('Get current borrows error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's borrowing history
// @route   GET /api/users/:id/borrow-history
// @access  Private
router.get('/:id/borrow-history', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Build filter
    const filter = { borrower: userId };
    if (status) {
      filter.status = status;
    }

    const borrowHistory = await BorrowRecord.find(filter)
      .populate('book', 'title author isbn coverImage')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BorrowRecord.countDocuments(filter);

    res.json({
      success: true,
      data: {
        borrowHistory,
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
    console.error('Get borrow history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's fine details
// @route   GET /api/users/:id/fines
// @access  Private
router.get('/:id/fines', protect, isOwnerOrAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const fines = await BorrowRecord.find({ 
      borrower: userId, 
      fine: { $gt: 0 } 
    })
      .populate('book', 'title author isbn')
      .populate('group', 'name')
      .sort({ createdAt: -1 });

    const totalFines = fines.reduce((sum, record) => sum + record.fine, 0);
    const unpaidFines = fines
      .filter(record => !record.isFinePaid)
      .reduce((sum, record) => sum + record.fine, 0);

    res.json({
      success: true,
      data: {
        fines,
        summary: {
          total: totalFines,
          unpaid: unpaidFines,
          paid: totalFines - unpaidFines
        }
      }
    });
  } catch (error) {
    console.error('Get user fines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user profile (admin only)
// @route   PUT /api/users/:id
// @access  Private (Admin only)
router.put('/:id', protect, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('address').optional().trim().isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Valid role is required')
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

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    // Check if user has active borrow records
    const activeBorrows = await BorrowRecord.countDocuments({
      borrower: req.params.id,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (activeBorrows > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active borrow records'
      });
    }

    // Check if user has unpaid fines
    if (user.totalFines > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with unpaid fines'
      });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
