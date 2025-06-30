const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  bankName: { type: String },
  accountNumber: { type: String },
  accountHolder: { type: String },
  qrCode: { type: String }, // image path
  type: { type: String, enum: ['Bank', 'eSewa', 'Khalti', 'Other'], default: 'Bank' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema); 