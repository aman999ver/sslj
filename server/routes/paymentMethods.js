const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
const { auth, requireRole } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// Add a new payment method
router.post('/', auth, requireRole(['admin', 'super-admin']), uploadSingle, paymentMethodController.addPaymentMethod);

// Get all payment methods (public)
router.get('/', paymentMethodController.getAllPaymentMethods);

// Update a payment method
router.put('/:id', auth, requireRole(['admin', 'super-admin']), uploadSingle, paymentMethodController.updatePaymentMethod);

// Delete a payment method
router.delete('/:id', auth, requireRole(['admin', 'super-admin']), paymentMethodController.deletePaymentMethod);

module.exports = router; 