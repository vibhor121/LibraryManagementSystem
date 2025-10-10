const express = require('express');
const { body, validationResult } = require('express-validator');
const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const User = require('../models/User');
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');
const { sendFineNotification } = require('../utils/emailService');

const router = express.Router();

// @desc    Borrow a book (individual)
// @route   POST /api/borrow/individual
// @access  Private
router.post('/individual', protect, [
  body('bookId').isMongoId().withMessage('Valid book ID is required')
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

    const { bookId } = req.body;
    const userId = req.user._id;

    // Check if book exists and is active
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available. All copies are currently borrowed.'
      });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await BorrowRecord.findOne({
      book: bookId,
      borrower: userId,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You already have this book borrowed'
      });
    }

    // Check if user already has any book borrowed (one book at a time rule)
    const existingUserBorrow = await BorrowRecord.findOne({
      borrower: userId,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (existingUserBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You can only borrow one book at a time. Please return your current book first.'
      });
    }

    // Check if user is in a group that has a book borrowed
    const userGroup = await Group.findOne({ 
      members: userId, 
      isActive: true 
    });
    
    if (userGroup) {
      const groupBorrow = await BorrowRecord.findOne({
        group: userGroup._id,
        status: { $in: ['borrowed', 'overdue'] }
      });
      
      if (groupBorrow) {
        return res.status(400).json({
          success: false,
          message: 'Your group already has a book borrowed. Group members cannot borrow books individually while the group has an active borrowing.'
        });
      }
    }

    // Check if user has unpaid fines
    const user = await User.findById(userId);
    if (user.totalFines > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have unpaid fines. Please clear your fines before borrowing more books.'
      });
    }

    // Create borrow record
    const borrowRecord = await BorrowRecord.create({
      book: bookId,
      borrower: userId,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now for individual
    });

    // Update book's borrowed copies count
    book.borrowedCopies += 1;
    await book.save();

    // Update user's borrowed books
    user.borrowedBooks.push(borrowRecord._id);
    await user.save();

    // Populate the borrow record for response
    await borrowRecord.populate('book', 'title author isbn');

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: { borrowRecord }
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Borrow a book (group)
// @route   POST /api/borrow/group
// @access  Private
router.post('/group', protect, [
  body('bookId').isMongoId().withMessage('Valid book ID is required'),
  body('groupId').isMongoId().withMessage('Valid group ID is required')
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

    const { bookId, groupId } = req.body;
    const userId = req.user._id;

    // Check if book exists and is active
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available. All copies are currently borrowed.'
      });
    }

    // Check if group exists and user is a member
    const group = await Group.findById(groupId).populate('members');
    if (!group || !group.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    const isMember = group.members.some(member => member._id.toString() === userId.toString());
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    // Check if group already has this book borrowed
    const existingGroupBorrow = await BorrowRecord.findOne({
      book: bookId,
      group: groupId,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (existingGroupBorrow) {
      return res.status(400).json({
        success: false,
        message: 'This group already has this book borrowed'
      });
    }

    // Check if group already has any book borrowed (one book at a time rule)
    const existingGroupAnyBorrow = await BorrowRecord.findOne({
      group: groupId,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (existingGroupAnyBorrow) {
      return res.status(400).json({
        success: false,
        message: 'This group can only borrow one book at a time. Please return the current book first.'
      });
    }

    // Check if any group member has unpaid fines
    const membersWithFines = group.members.filter(member => member.totalFines > 0);
    if (membersWithFines.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some group members have unpaid fines. Please clear all fines before borrowing.'
      });
    }

    // Check if any group member already has a book borrowed individually
    const membersWithIndividualBooks = [];
    for (const member of group.members) {
      const individualBorrow = await BorrowRecord.findOne({
        borrower: member._id,
        group: null, // Individual borrowing
        status: { $in: ['borrowed', 'overdue'] }
      });
      if (individualBorrow) {
        membersWithIndividualBooks.push(member.name);
      }
    }
    
    if (membersWithIndividualBooks.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Group members ${membersWithIndividualBooks.join(', ')} already have individual books borrowed. Group members cannot have both individual and group books at the same time.`
      });
    }

    // Create borrow record for group
    const borrowRecord = await BorrowRecord.create({
      book: bookId,
      borrower: userId, // Group leader or person who initiated the borrow
      group: groupId,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days (6 months) from now for group
    });

    // Update book's borrowed copies count
    book.borrowedCopies += 1;
    await book.save();

    // Update group's borrowed books
    group.borrowedBooks.push(borrowRecord._id);
    await group.save();

    // Populate the borrow record for response
    await borrowRecord.populate([
      { path: 'book', select: 'title author isbn' },
      { path: 'group', select: 'name members' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully for group',
      data: { borrowRecord }
    });
  } catch (error) {
    console.error('Borrow book for group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Return a book
// @route   PUT /api/borrow/return/:id
// @access  Private
router.put('/return/:id', protect, [
  body('condition').isIn(['good', 'minor_damage', 'major_damage', 'lost']).withMessage('Valid condition is required'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
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

    const { condition, notes, actualReturnDate } = req.body;
    const borrowRecordId = req.params.id;
    const userId = req.user._id;

    // Find borrow record
    const borrowRecord = await BorrowRecord.findById(borrowRecordId)
      .populate('book borrower group');

    if (!borrowRecord) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Check if user has permission to return this book
    const canReturn = borrowRecord.borrower._id.toString() === userId.toString() ||
                     (borrowRecord.group && borrowRecord.group.members.some(member => member._id.toString() === userId.toString()));

    if (!canReturn) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to return this book'
      });
    }

    // Check if book is already returned
    if (borrowRecord.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book is already returned'
      });
    }

    // Update borrow record
    borrowRecord.status = 'returned';
    borrowRecord.condition = condition;
    borrowRecord.returnDate = actualReturnDate ? new Date(actualReturnDate) : new Date();
    borrowRecord.notes = notes;

    // Calculate fine based on condition and time
    const fine = borrowRecord.calculateFine(borrowRecord.book.price);
    await borrowRecord.save();

    // Update book's borrowed copies count
    const book = borrowRecord.book;
    book.borrowedCopies -= 1;
    await book.save();

    // Update user/group fines
    if (borrowRecord.group) {
      // Group borrowing - distribute fine equally
      const finePerMember = fine / borrowRecord.group.members.length;
      
      // Update each member's total fines
      for (const member of borrowRecord.group.members) {
        await User.findByIdAndUpdate(member._id, {
          $inc: { totalFines: finePerMember }
        });
      }
      
      // Update group's total fines
      await Group.findByIdAndUpdate(borrowRecord.group._id, {
        $inc: { totalFines: fine }
      });
    } else {
      // Individual borrowing
      await User.findByIdAndUpdate(borrowRecord.borrower._id, {
        $inc: { totalFines: fine }
      });
    }

    // Send fine notification if there's a fine
    if (fine > 0) {
      try {
        await sendFineNotification(borrowRecord.borrower, borrowRecord, book, fine, borrowRecord.fineReason);
      } catch (emailError) {
        console.error('Error sending fine notification:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Book returned successfully',
      data: { 
        borrowRecord,
        fine: fine > 0 ? fine : 0,
        fineReason: borrowRecord.fineReason
      }
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user's borrow history
// @route   GET /api/borrow/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Build filter
    const filter = { borrower: req.user._id };
    if (status) {
      filter.status = status;
    }

    const borrowRecords = await BorrowRecord.find(filter)
      .populate('book', 'title author isbn coverImage')
      .populate('group', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
    console.error('Get borrow history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get current borrowings
// @route   GET /api/borrow/current
// @access  Private
router.get('/current', protect, async (req, res) => {
  try {
    const borrowRecords = await BorrowRecord.find({
      borrower: req.user._id,
      status: { $in: ['borrowed', 'overdue'] }
    })
      .populate('book', 'title author isbn coverImage')
      .populate('group', 'name')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: { borrowRecords }
    });
  } catch (error) {
    console.error('Get current borrowings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Pay fine
// @route   PUT /api/borrow/pay-fine/:id
// @access  Private
router.put('/pay-fine/:id', protect, async (req, res) => {
  try {
    const borrowRecordId = req.params.id;
    const userId = req.user._id;

    // Find borrow record
    const borrowRecord = await BorrowRecord.findById(borrowRecordId)
      .populate('borrower group');

    if (!borrowRecord) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Check if user has permission to pay this fine
    const canPay = borrowRecord.borrower._id.toString() === userId.toString() ||
                   (borrowRecord.group && borrowRecord.group.members.some(member => member._id.toString() === userId.toString()));

    if (!canPay) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to pay this fine'
      });
    }

    // Check if fine is already paid
    if (borrowRecord.isFinePaid) {
      return res.status(400).json({
        success: false,
        message: 'Fine is already paid'
      });
    }

    // Mark fine as paid
    borrowRecord.isFinePaid = true;
    borrowRecord.finePaidDate = new Date();
    await borrowRecord.save();

    // Update user/group total fines
    if (borrowRecord.group) {
      // Group borrowing - reduce fine from each member
      const finePerMember = borrowRecord.fine / borrowRecord.group.members.length;
      
      for (const member of borrowRecord.group.members) {
        await User.findByIdAndUpdate(member._id, {
          $inc: { totalFines: -finePerMember }
        });
      }
      
      // Update group's total fines
      await Group.findByIdAndUpdate(borrowRecord.group._id, {
        $inc: { totalFines: -borrowRecord.fine }
      });
    } else {
      // Individual borrowing
      await User.findByIdAndUpdate(borrowRecord.borrower._id, {
        $inc: { totalFines: -borrowRecord.fine }
      });
    }

    res.json({
      success: true,
      message: 'Fine paid successfully',
      data: { borrowRecord }
    });
  } catch (error) {
    console.error('Pay fine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
