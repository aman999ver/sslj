const Order = require('../models/Order');
const ClientUser = require('../models/ClientUser');

// Get all orders for admin
exports.getAllOrders = async (req, res) => {
  try {
    console.log('Admin getAllOrders called by user:', req.user);
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    console.log('Query:', query);
    
    // First, let's check if there are any orders at all
    const totalOrdersInDB = await Order.countDocuments({});
    console.log('Total orders in database:', totalOrdersInDB);
    
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product')
      .populate('paymentDetails.verifiedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    console.log('Found orders:', orders.length);
    if (orders.length > 0) {
      orders.forEach((order, idx) => {
        console.log(`Order[${idx}]:`, {
          orderNumber: order.orderNumber,
          user: order.user,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus
        });
      });
    } else {
      console.log('No orders found for query:', query);
    }
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: skip + orders.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to get orders' });
  }
};

// Get order by ID for admin
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('user', 'firstName lastName email phone address')
      .populate('items.product')
      .populate('paymentDetails.verifiedBy', 'username');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to get order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, notes } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    order.orderStatus = orderStatus;
    if (notes) order.notes = notes;
    
    // If status is "Delivered", set deliveredAt
    if (orderStatus === 'Delivered') {
      order.deliveredAt = new Date();
    }
    
    await order.save();
    
    res.json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, transactionId, paymentGateway } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === 'Paid') {
      order.paymentDetails = {
        ...order.paymentDetails,
        transactionId,
        paymentGateway,
        paidAt: new Date()
      };
    }
    
    await order.save();
    
    res.json({ success: true, message: 'Payment status updated successfully', order });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment status' });
  }
};

// Verify payment with screenshot
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentScreenshot, paymentNotes, transactionId, paymentGateway } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Update payment details
    order.paymentDetails = {
      ...order.paymentDetails,
      paymentScreenshot,
      paymentNotes,
      transactionId,
      paymentGateway,
      verifiedBy: req.user._id,
      verifiedAt: new Date()
    };
    
    // Set payment status to paid
    order.paymentStatus = 'Paid';
    
    await order.save();
    
    res.json({ 
      success: true, 
      message: 'Payment verified successfully', 
      order 
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

// Reject payment verification
exports.rejectPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rejectionReason } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Set payment status back to pending
    order.paymentStatus = 'Pending';
    
    // Add rejection note
    if (rejectionReason) {
      order.paymentDetails = {
        ...order.paymentDetails,
        paymentNotes: `Payment rejected: ${rejectionReason}`
      };
    }
    
    await order.save();
    
    res.json({ 
      success: true, 
      message: 'Payment rejected successfully', 
      order 
    });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject payment' });
  }
};

// Get orders requiring payment verification
exports.getOrdersRequiringVerification = async (req, res) => {
  try {
    const orders = await Order.find({ 
      paymentStatus: 'Verification Required',
      'paymentDetails.paymentScreenshot': { $exists: true, $ne: null }
    })
      .populate('user', 'firstName lastName email phone')
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders requiring verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to get orders requiring verification' });
  }
};

// Get sales analytics
exports.getSalesAnalytics = async (req, res) => {
  try {
    console.log('Sales analytics requested by user:', req.user.username);
    const { startDate, endDate } = req.query;
    
    console.log('Date range:', { startDate, endDate });
    
    let dateFilter = {};
    // Only apply date filter if both startDate and endDate are provided
    if (startDate && endDate && startDate !== '' && endDate !== '') {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
      console.log('Date filter applied:', dateFilter);
    } else {
      console.log('No date filter - fetching all historical data');
    }
    
    // Get all orders in date range
    const orders = await Order.find(dateFilter).populate('items.product');
    console.log('Orders found for analytics:', orders.length);
    
    // Calculate analytics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalItems = orders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
    
    // Status breakdown
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});
    
    // Payment status breakdown
    const paymentBreakdown = orders.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {});
    
    // Payment method breakdown
    const paymentMethodBreakdown = orders.reduce((acc, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      return acc;
    }, {});
    
    // Top selling products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product) {
          const productId = item.product._id.toString();
          if (!productSales[productId]) {
            productSales[productId] = {
              name: item.product.name,
              category: item.product.category,
              metalType: item.product.metalType,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.totalPrice;
        }
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    // Monthly revenue (last 12 months)
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthOrders = orders.filter(order => 
        order.createdAt >= month && order.createdAt < nextMonth
      );
      
      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      monthlyRevenue.push({
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        orders: monthOrders.length
      });
    }
    
    // Daily revenue for current month
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const currentMonthOrders = orders.filter(order => 
      order.createdAt >= currentMonth && order.createdAt < nextMonth
    );
    
    const dailyRevenue = [];
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), day);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), day + 1);
      
      const dayOrders = currentMonthOrders.filter(order => 
        order.createdAt >= dayStart && order.createdAt < dayEnd
      );
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      dailyRevenue.push({
        day: day,
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }
    
    // Customer analytics
    const customerOrders = {};
    orders.forEach(order => {
      const customerId = order.user._id.toString();
      const customerName = `${order.user.firstName} ${order.user.lastName}`;
      if (!customerOrders[customerId]) {
        customerOrders[customerId] = {
          name: customerName,
          email: order.user.email,
          orderCount: 0,
          totalSpent: 0
        };
      }
      customerOrders[customerId].orderCount += 1;
      customerOrders[customerId].totalSpent += order.totalAmount;
    });
    
    const topCustomers = Object.entries(customerOrders)
      .sort(([,a], [,b]) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
    
    // Yearly revenue breakdown
    const yearlyRevenue = {};
    orders.forEach(order => {
      const year = order.createdAt.getFullYear();
      if (!yearlyRevenue[year]) {
        yearlyRevenue[year] = {
          revenue: 0,
          orders: 0
        };
      }
      yearlyRevenue[year].revenue += order.totalAmount;
      yearlyRevenue[year].orders += 1;
    });
    
    const yearlyRevenueArray = Object.entries(yearlyRevenue)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([year, data]) => ({
        year: parseInt(year),
        revenue: data.revenue,
        orders: data.orders
      }));
    
    const analytics = {
      totalOrders,
      totalRevenue,
      totalItems,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      statusBreakdown,
      paymentBreakdown,
      paymentMethodBreakdown,
      topProducts,
      monthlyRevenue,
      dailyRevenue,
      topCustomers,
      yearlyRevenue: yearlyRevenueArray,
      dateRange: { startDate, endDate },
      dataSource: dateFilter.createdAt ? 'Filtered' : 'All Historical Data'
    };
    
    console.log('Analytics calculated:', {
      totalOrders,
      totalRevenue,
      totalItems,
      averageOrderValue: analytics.averageOrderValue
    });
    
    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to get sales analytics' });
  }
};

// Get recent orders for dashboard
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('items.product')
      .populate('paymentDetails.verifiedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ success: true, orders: recentOrders });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to get recent orders' });
  }
}; 