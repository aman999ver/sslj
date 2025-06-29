const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const ClientUser = require('../models/ClientUser');

const auth = async (req, res, next) => {
  try {
    console.log('Admin auth middleware called for:', req.url);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Token received:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', { userId: decoded.userId });
    
    const user = await AdminUser.findById(decoded.userId).select('-password');
    console.log('User found:', user ? 'Yes' : 'No', user ? { id: user._id, username: user.username, role: user.role } : 'No user');
    
    if (!user || !user.isActive) {
      console.log('User not found or inactive');
      return res.status(401).json({ message: 'Invalid token or user inactive.' });
    }

    req.user = user;
    console.log('Admin auth successful for user:', user.username);
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    console.log('requireRole middleware called');
    console.log('User:', req.user ? { id: req.user._id, username: req.user.username, role: req.user.role } : 'No user');
    console.log('Required roles:', roles);
    
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    console.log('User role:', req.user.role);
    console.log('Required roles:', roles);
    console.log('User role in required roles:', roles.includes(req.user.role));
    
    if (!roles.includes(req.user.role)) {
      console.log('User role not in required roles');
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }
    
    console.log('Role check passed');
    next();
  };
};

const clientAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await ClientUser.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or user inactive.' });
    }
    req.user = { userId: user._id };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { auth, requireRole, clientAuth }; 