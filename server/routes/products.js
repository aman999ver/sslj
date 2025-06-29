const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProduct, 
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  addReview,
  getReviews,
  replyToReview
} = require('../controllers/productController');
const { auth, requireRole, clientAuth } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin routes (protected)
router.get('/admin/all', auth, requireRole(['admin', 'super-admin']), getAdminProducts);
router.post('/', auth, requireRole(['admin', 'super-admin']), uploadMultiple, createProduct);
router.put('/:id', auth, requireRole(['admin', 'super-admin']), uploadMultiple, updateProduct);
router.delete('/:id', auth, requireRole(['admin', 'super-admin']), deleteProduct);

// Reviews
router.post('/:productId/reviews', clientAuth, addReview);
router.get('/:productId/reviews', getReviews);
router.post('/:productId/reviews/:reviewId/reply', auth, requireRole(['admin', 'super-admin']), replyToReview);

module.exports = router; 