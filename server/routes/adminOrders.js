const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');
const { auth, requireRole } = require('../middleware/auth');

// Debug endpoint - remove in production
router.get('/debug/all', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const orders = await Order.find({}).populate('user', 'firstName lastName email');
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// All routes require admin authentication
router.use(auth);
router.use(requireRole(['admin', 'super-admin']));

// Get all orders with pagination and filters
router.get('/', adminOrderController.getAllOrders);

// Get order by ID
router.get('/:orderId', adminOrderController.getOrderById);

// Update order status
router.patch('/:orderId/status', adminOrderController.updateOrderStatus);

// Update payment status
router.patch('/:orderId/payment-status', adminOrderController.updatePaymentStatus);

// Verify payment with screenshot
router.post('/:orderId/verify-payment', adminOrderController.verifyPayment);

// Reject payment verification
router.post('/:orderId/reject-payment', adminOrderController.rejectPayment);

// Get orders requiring payment verification
router.get('/verification/pending', adminOrderController.getOrdersRequiringVerification);

// Get sales analytics
router.get('/analytics/sales', adminOrderController.getSalesAnalytics);

// Get recent orders for dashboard
router.get('/recent/orders', adminOrderController.getRecentOrders);

module.exports = router; 