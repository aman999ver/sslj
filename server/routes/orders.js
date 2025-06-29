const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { clientAuth } = require('../middleware/auth');

// Place a new order
router.post('/place', clientAuth, orderController.placeOrder);

// Get all orders for current user
router.get('/', clientAuth, orderController.getOrders);

// Get a specific order by ID
router.get('/:orderId', clientAuth, orderController.getOrderById);

// Upload payment screenshot
router.post('/:orderId/upload-payment', clientAuth, orderController.uploadPaymentScreenshot);

module.exports = router; 