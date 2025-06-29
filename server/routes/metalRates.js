const express = require('express');
const router = express.Router();
const {
  getCurrentRates,
  getAllRates,
  updateRate,
  updateMultipleRates,
  getRateHistory,
  initializeRates
} = require('../controllers/metalRateController');
const { auth, requireRole } = require('../middleware/auth');

// Public route
router.get('/current', getCurrentRates);

// Admin routes (protected)
router.get('/all', auth, requireRole(['admin', 'super-admin']), getAllRates);
router.post('/update', auth, requireRole(['admin', 'super-admin']), updateRate);
router.post('/update-multiple', auth, requireRole(['admin', 'super-admin']), updateMultipleRates);
router.get('/history', auth, requireRole(['admin', 'super-admin']), getRateHistory);
router.post('/initialize', auth, requireRole(['admin', 'super-admin']), initializeRates);

module.exports = router; 