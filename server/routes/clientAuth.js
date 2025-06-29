const express = require('express');
const router = express.Router();
const clientAuthController = require('../controllers/clientAuthController');
const { clientAuth } = require('../middleware/auth');
const { auth, requireRole } = require('../middleware/auth');

// Public routes
router.post('/register', clientAuthController.register);
router.post('/login', clientAuthController.login);

// Protected routes
router.get('/profile', clientAuth, clientAuthController.getProfile);
router.put('/profile', clientAuth, clientAuthController.updateProfile);
router.post('/change-password', clientAuth, clientAuthController.changePassword);

// Admin: Get all clients
router.get('/admin/all', auth, requireRole(['admin', 'super-admin']), clientAuthController.getAllClients);

module.exports = router; 