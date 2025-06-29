const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProduct, 
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts
} = require('../controllers/productController');
const { auth, requireRole } = require('../middleware/auth');
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

module.exports = router; 