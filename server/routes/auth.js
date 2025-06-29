const express = require('express');
const router = express.Router();
const { login, getProfile, changePassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.post('/change-password', auth, changePassword);

module.exports = router; 