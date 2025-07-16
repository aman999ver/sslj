const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const multer = require('multer');
const path = require('path');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// TODO: Add admin auth middleware for POST/DELETE

router.get('/', bannerController.getBanners);
router.post('/', upload.single('image'), bannerController.createBanner);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router; 