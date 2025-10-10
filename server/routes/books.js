// const express = require('express');
// const { body, validationResult, query } = require('express-validator');
// const Book = require('../models/Book');
// const { protect, authorize } = require('../middleware/auth');

// const router = express.Router();

// // @desc    Get all books with search and filter
// // @route   GET /api/books
// // @access  Public
// router.get('/', [
//   query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
//   query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
//   query('search').optional().trim(),
//   query('genre').optional().trim(),
//   query('author').optional().trim(),
//   query('available').optional().isBoolean().withMessage('Available must be a boolean')
// ], async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Build filter object
//     const filter = { isActive: true };

//     // Search functionality
//     if (req.query.search) {
//       filter.$text = { $search: req.query.search };
//     }

//     // Genre filter
//     if (req.query.genre) {
//       filter.genre = new RegExp(req.query.genre, 'i');
//     }

//     // Author filter
//     if (req.query.author) {
//       filter.author = new RegExp(req.query.author, 'i');
//     }

//     // Availability filter
//     if (req.query.available === 'true') {
//       filter.availableCopies = { $gt: 0 };
//     }

//     // Get books with pagination
//     const books = await Book.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .select('-__v');

//     // Get total count for pagination
//     const total = await Book.countDocuments(filter);

//     res.json({
//       success: true,
//       data: {
//         books,
//         pagination: {
//           currentPage: page,
//           totalPages: Math.ceil(total / limit),
//           totalBooks: total,
//           hasNext: page < Math.ceil(total / limit),
//           hasPrev: page > 1
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get books error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Get single book
// // @route   GET /api/books/:id
// // @access  Public
// router.get('/:id', async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);

//     if (!book || !book.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Book not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: { book }
//     });
//   } catch (error) {
//     console.error('Get book error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Create new book
// // @route   POST /api/books
// // @access  Private (Admin only)
// router.post('/', protect, authorize('admin'), [
//   body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
//   body('author').trim().isLength({ min: 1, max: 100 }).withMessage('Author is required and must be less than 100 characters'),
//   body('isbn').matches(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/).withMessage('Please provide a valid ISBN'),
//   body('genre').trim().notEmpty().withMessage('Genre is required'),
//   body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
//   body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
//   body('publicationYear').isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Invalid publication year'),
//   body('publisher').trim().notEmpty().withMessage('Publisher is required'),
//   body('language').optional().trim(),
//   body('pages').optional().isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
//   body('totalCopies').optional().isInt({ min: 1, max: 10 }).withMessage('Total copies must be between 1 and 10')
// ], async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const {
//       title,
//       author,
//       isbn,
//       genre,
//       description,
//       price,
//       publicationYear,
//       publisher,
//       language = 'English',
//       pages,
//       totalCopies = 3
//     } = req.body;

//     // Check if book with same ISBN already exists
//     const existingBook = await Book.findOne({ isbn });
//     if (existingBook) {
//       return res.status(400).json({
//         success: false,
//         message: 'Book with this ISBN already exists'
//       });
//     }

//     // Create book
//     const book = await Book.create({
//       title,
//       author,
//       isbn,
//       genre,
//       description,
//       price,
//       publicationYear,
//       publisher,
//       language,
//       pages,
//       totalCopies,
//       availableCopies: totalCopies
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Book created successfully',
//       data: { book }
//     });
//   } catch (error) {
//     console.error('Create book error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Update book
// // @route   PUT /api/books/:id
// // @access  Private (Admin only)
// router.put('/:id', protect, authorize('admin'), [
//   body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
//   body('author').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Author must be less than 100 characters'),
//   body('isbn').optional().matches(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/).withMessage('Please provide a valid ISBN'),
//   body('genre').optional().trim().notEmpty().withMessage('Genre cannot be empty'),
//   body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
//   body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
//   body('publicationYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Invalid publication year'),
//   body('publisher').optional().trim().notEmpty().withMessage('Publisher cannot be empty'),
//   body('language').optional().trim(),
//   body('pages').optional().isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
//   body('totalCopies').optional().isInt({ min: 1, max: 10 }).withMessage('Total copies must be between 1 and 10')
// ], async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const book = await Book.findById(req.params.id);

//     if (!book) {
//       return res.status(404).json({
//         success: false,
//         message: 'Book not found'
//       });
//     }

//     // Check if ISBN is being changed and if it already exists
//     if (req.body.isbn && req.body.isbn !== book.isbn) {
//       const existingBook = await Book.findOne({ isbn: req.body.isbn });
//       if (existingBook) {
//         return res.status(400).json({
//           success: false,
//           message: 'Book with this ISBN already exists'
//         });
//       }
//     }

//     // Update book
//     const updatedBook = await Book.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     res.json({
//       success: true,
//       message: 'Book updated successfully',
//       data: { book: updatedBook }
//     });
//   } catch (error) {
//     console.error('Update book error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Delete book (soft delete)
// // @route   DELETE /api/books/:id
// // @access  Private (Admin only)
// router.delete('/:id', protect, authorize('admin'), async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);

//     if (!book) {
//       return res.status(404).json({
//         success: false,
//         message: 'Book not found'
//       });
//     }

//     // Check if book has active borrow records
//     const BorrowRecord = require('../models/BorrowRecord');
//     const activeBorrows = await BorrowRecord.countDocuments({
//       book: req.params.id,
//       status: { $in: ['borrowed', 'overdue'] }
//     });

//     if (activeBorrows > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete book with active borrow records'
//       });
//     }

//     // Soft delete
//     book.isActive = false;
//     await book.save();

//     res.json({
//       success: true,
//       message: 'Book deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete book error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Get book statistics
// // @route   GET /api/books/stats/overview
// // @access  Private (Admin only)
// router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
//   try {
//     const totalBooks = await Book.countDocuments({ isActive: true });
//     const totalCopies = await Book.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: null, total: { $sum: '$totalCopies' } } }
//     ]);
    
//     const availableCopies = await Book.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: null, total: { $sum: '$availableCopies' } } }
//     ]);

//     const borrowedCopies = await Book.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: null, total: { $sum: '$borrowedCopies' } } }
//     ]);

//     const genreStats = await Book.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: '$genre', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 10 }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalBooks,
//         totalCopies: totalCopies[0]?.total || 0,
//         availableCopies: availableCopies[0]?.total || 0,
//         borrowedCopies: borrowedCopies[0]?.total || 0,
//         genreStats
//       }
//     });
//   } catch (error) {
//     console.error('Get book stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Book = require('../models/Book');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ----------------------
// Multer + Cloudinary Setup
// ----------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'library_books',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ storage });

// ----------------------
// Add Book (Admin Only)
// ----------------------
router.post('/', protect, authorize('admin'), upload.single('coverImage'), async (req, res) => {
  try {
    console.log('📥 req.body:', req.body);
    console.log('📸 req.file:', req.file);

    // Cover image is optional - use default if not provided
    let coverImageUrl = '';
    if (req.file) {
      coverImageUrl = req.file.path;
    }

    // Convert numeric fields
    const price = parseFloat(req.body.price) || 0;
    const publicationYear = parseInt(req.body.publicationYear) || new Date().getFullYear();
    const pages = parseInt(req.body.pages) || 0;
    const totalCopies = parseInt(req.body.totalCopies) || 1;

    // Required fields validation
    const requiredFields = ['title', 'author', 'isbn', 'genre', 'description', 'publisher'];
    for (let field of requiredFields) {
      if (!req.body[field] || req.body[field].trim() === '') {
        return res.status(400).json({ success: false, message: `${field} is required.` });
      }
    }

    // Remove hyphens from ISBN before saving (optional, ensures regex match)
    const isbn = req.body.isbn.replace(/-/g, '');

    // Check duplicate ISBN
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists.' });
    }

    // Create new book
    const newBook = await Book.create({
      title: req.body.title,
      author: req.body.author,
      isbn,
      genre: req.body.genre,
      description: req.body.description,
      price,
      publicationYear,
      publisher: req.body.publisher,
      language: req.body.language || 'English',
      pages,
      totalCopies,
      availableCopies: totalCopies,
      coverImage: coverImageUrl
    });

    console.log('✅ Book created:', newBook);

    const allBooks = await Book.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: 'Book added successfully!',
      data: newBook
    });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});


// ----------------------
// Get All Books (Optional Separate Route)
// ----------------------
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ----------------------
// Update Book (Admin Only)
// ----------------------
router.put('/:id', protect, authorize('admin'), upload.single('coverImage'), async (req, res) => {
  try {
    console.log('📝 Updating book:', req.params.id);
    console.log('📥 req.body:', req.body);
    console.log('📸 req.file:', req.file);

    const bookId = req.params.id;
    
    // Check if book exists
    const existingBook = await Book.findById(bookId);
    if (!existingBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Cover image handling
    let coverImageUrl = existingBook.coverImage;
    if (req.file) {
      coverImageUrl = req.file.path;
    }

    // Convert numeric fields
    const price = parseFloat(req.body.price) || existingBook.price;
    const publicationYear = parseInt(req.body.publicationYear) || existingBook.publicationYear;
    const pages = parseInt(req.body.pages) || existingBook.pages;
    const totalCopies = parseInt(req.body.totalCopies) || existingBook.totalCopies;

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        title: req.body.title || existingBook.title,
        author: req.body.author || existingBook.author,
        isbn: req.body.isbn || existingBook.isbn,
        genre: req.body.genre || existingBook.genre,
        description: req.body.description || existingBook.description,
        price,
        publicationYear,
        publisher: req.body.publisher || existingBook.publisher,
        language: req.body.language || existingBook.language,
        pages,
        totalCopies,
        coverImage: coverImageUrl,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Book updated:', updatedBook);
    res.status(200).json({ success: true, message: 'Book updated successfully!', data: updatedBook });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ----------------------
// Delete Book (Admin Only)
// ----------------------
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('🗑️ Deleting book:', req.params.id);

    const bookId = req.params.id;
    
    // Check if book exists
    const existingBook = await Book.findById(bookId);
    if (!existingBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if book has active borrows
    const BorrowRecord = require('../models/BorrowRecord');
    const activeBorrows = await BorrowRecord.find({ 
      book: bookId, 
      status: { $in: ['borrowed', 'overdue'] } 
    });

    if (activeBorrows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete book with active borrows. Please wait for all copies to be returned.' 
      });
    }

    // Delete the book
    await Book.findByIdAndDelete(bookId);

    console.log('✅ Book deleted successfully');
    res.status(200).json({ success: true, message: 'Book deleted successfully!' });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
