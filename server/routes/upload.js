const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'my_app_images', // optional folder
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const parser = multer({ storage });

// Upload single image
router.post('/', parser.single('image'), (req, res) => {
  try {
    res.json({ success: true, url: req.file.path });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
