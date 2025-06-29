const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { clientAuth } = require('../middleware/auth');

// Get current user's cart
router.get('/', clientAuth, cartController.getCart);

// Add item to cart
router.post('/add', clientAuth, cartController.addToCart);

// Update item quantity
router.put('/update', clientAuth, cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:productId', clientAuth, cartController.removeFromCart);

// Clear cart
router.delete('/clear', clientAuth, cartController.clearCart);

module.exports = router; 