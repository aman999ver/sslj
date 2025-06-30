const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const metalRateRoutes = require('./routes/metalRates');
const clientAuthRoutes = require('./routes/clientAuth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminOrderRoutes = require('./routes/adminOrders');
const categoryRoutes = require('./routes/categories');
const inquiriesRoute = require('./routes/inquiries');
const paymentMethodsRoute = require('./routes/paymentMethods');

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://subhalaxmijewellery.com.np', 'https://www.subhalaxmijewellery.com.np']
  : 'http://localhost:3000';

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate limiting - only apply to auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes only
app.use('/api/auth', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://geniusappsolu:sslj@cluster0.dqkklnk.mongodb.net/sslj?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/metal-rates', metalRateRoutes);
app.use('/api/client', clientAuthRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api', categoryRoutes);
app.use('/api/inquiries', inquiriesRoute);
app.use('/api/payment-methods', paymentMethodsRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Subha Laxmi Jewellery API is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check orders - remove in production
app.get('/api/debug/orders', async (req, res) => {
  try {
    const Order = require('./models/Order');
    const orders = await Order.find({}).populate('user', 'firstName lastName email');
    res.json({ 
      success: true, 
      count: orders.length, 
      orders: orders.map(o => ({
        id: o._id,
        orderNumber: o.orderNumber,
        user: o.user,
        totalAmount: o.totalAmount,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        createdAt: o.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint to check admin users - remove in production
app.get('/api/debug/admins', async (req, res) => {
  try {
    const AdminUser = require('./models/AdminUser');
    const admins = await AdminUser.find({}).select('-password');
    res.json({ 
      success: true, 
      count: admins.length, 
      admins: admins.map(a => ({
        id: a._id,
        username: a.username,
        email: a.email,
        role: a.role,
        isActive: a.isActive
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 