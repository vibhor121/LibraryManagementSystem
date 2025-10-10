// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('../config/cloudinary');

// // Configure Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'my_app_images', // optional folder
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//   },
// });

// const parser = multer({ storage });

// // Upload single image
// router.post('/', parser.single('image'), (req, res) => {
//   try {
//     res.json({ success: true, url: req.file.path });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
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
// Cloudinary setup
// ----------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'library_books',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
const upload = multer({ storage });

// ----------------------
// Add Book (Admin only)
// ----------------------
router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    console.log('📥 Incoming req.body:', req.body);
    console.log('📸 Incoming req.file:', req.file);

    // Convert numeric fields safely
    const price = parseFloat(req.body.price) || 0;
    const publicationYear = parseInt(req.body.publicationYear) || new Date().getFullYear();
    const pages = parseInt(req.body.pages) || 0;
    const totalCopies = parseInt(req.body.totalCopies) || 1;

    // Required fields simple check
    const requiredFields = ['title', 'author', 'isbn', 'genre', 'description', 'publisher'];
    for (let field of requiredFields) {
      if (!req.body[field] || req.body[field].trim() === '') {
        return res.status(400).json({ success: false, message: `${field} is required.` });
      }
    }

    // Check duplicate ISBN
    const existingBook = await Book.findOne({ isbn: req.body.isbn });
    if (existingBook) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists.' });
    }

    // Get Cloudinary image URL
    const imageUrl = req.file ? req.file.path : null;

    const newBook = await Book.create({
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: req.body.genre,
      description: req.body.description,
      price,
      publicationYear,
      publisher: req.body.publisher,
      language: req.body.language || 'English',
      pages,
      totalCopies,
      availableCopies: totalCopies,
      image: imageUrl,
    });

    console.log('✅ Book created successfully:', newBook);

    res.status(201).json({
      success: true,
      message: 'Book added successfully!',
      data: newBook,
    });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
