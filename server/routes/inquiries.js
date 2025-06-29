const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { auth, requireRole } = require('../middleware/auth');

// Public: Submit inquiry
router.post('/', inquiryController.createInquiry);

// Admin: Get all inquiries
router.get('/', auth, requireRole(['admin', 'super-admin']), inquiryController.getAllInquiries);

// Admin: Delete an inquiry
router.delete('/:id', auth, requireRole(['admin', 'super-admin']), inquiryController.deleteInquiry);

module.exports = router; 