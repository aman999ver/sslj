const Order = require('../models/Order');
const Cart = require('../models/Cart');
const ClientUser = require('../models/ClientUser');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentMethod, shippingAddress, billingAddress, notes, paymentScreenshot, transactionId, paymentGateway, paymentNotes } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }
    
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    
    // Prepare order items
    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.price * item.quantity
    }));
    
    // Normalize payment method to uppercase
    const normalizedPaymentMethod = paymentMethod ? paymentMethod.toUpperCase() : 'COD';
    
    // Determine payment status based on payment method
    let paymentStatus = 'Pending';
    if (normalizedPaymentMethod === 'COD') {
      paymentStatus = 'Pending';
    } else if (normalizedPaymentMethod === 'ESEWA' || normalizedPaymentMethod === 'BANK_TRANSFER') {
      // Check if payment screenshot is provided
      if (!paymentScreenshot || !transactionId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Payment screenshot and transaction ID are required for eSewa and bank transfer payments' 
        });
      }
      paymentStatus = 'Verification Required'; // Requires admin verification
    } else {
      paymentStatus = 'Pending';
    }
    
    // Prepare payment details
    let paymentDetails = {};
    if (normalizedPaymentMethod === 'ESEWA' || normalizedPaymentMethod === 'BANK_TRANSFER') {
      paymentDetails = {
        paymentScreenshot,
        transactionId,
        paymentGateway,
        paymentNotes
      };
    }
    
    // Generate order number
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `SLJ-${timestamp}-${random}`;
    
    // Create order
    const order = new Order({
      orderNumber,
      user: userId,
      items,
      subtotal: cart.totalAmount,
      tax: 0,
      shippingCost: 0,
      totalAmount: cart.totalAmount,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus,
      orderStatus: 'Pending',
      notes: notes || '',
      paymentDetails
    });
    
    // Calculate totals
    order.calculateTotals();
    
    // Save order
    await order.save();
    
    // Clear cart
    cart.clearCart();
    await cart.save();
    
    // Populate order data before sending response
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('items.product');
    
    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully',
      order: populatedOrder 
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to place order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Upload payment screenshot
exports.uploadPaymentScreenshot = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;
    const { paymentScreenshot, transactionId, paymentGateway, notes } = req.body;
    
    // Find order and verify ownership
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Check if order requires payment verification
    if (order.paymentMethod !== 'ONLINE') {
      return res.status(400).json({ success: false, message: 'This order does not require payment verification' });
    }
    
    // Update payment details
    order.paymentDetails = {
      ...order.paymentDetails,
      paymentScreenshot,
      transactionId,
      paymentGateway,
      paymentNotes: notes
    };
    
    // Set payment status to verification required
    order.paymentStatus = 'Verification Required';
    
    await order.save();
    
    res.json({ 
      success: true, 
      message: 'Payment screenshot uploaded successfully. Admin will verify your payment.',
      order 
    });
  } catch (error) {
    console.error('Upload payment screenshot error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload payment screenshot' });
  }
};

// Get all orders for current user
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get orders' });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('items.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get order' });
  }
}; 