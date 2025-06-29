const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithCounts
} = require('../controllers/categoryController');
const { uploadSingle } = require('../middleware/upload');

// Public routes
router.get('/categories', getAllCategories);
router.get('/categories/with-counts', getCategoriesWithCounts);
router.get('/categories/:id', getCategory);

// Admin routes
router.post('/categories', uploadSingle, auth, requireRole(['admin', 'super-admin']), createCategory);
router.put('/categories/:id', uploadSingle, auth, requireRole(['admin', 'super-admin']), updateCategory);
router.delete('/categories/:id', auth, requireRole(['admin', 'super-admin']), deleteCategory);

module.exports = router; 