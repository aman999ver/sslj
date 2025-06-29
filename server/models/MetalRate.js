const mongoose = require('mongoose');

const metalRateSchema = new mongoose.Schema({
  metalType: {
    type: String,
    required: [true, 'Metal type is required'],
    enum: ['24K', '22K', 'Silver'],
    unique: true
  },
  ratePerTola: {
    type: Number,
    required: [true, 'Rate per tola is required'],
    min: [0, 'Rate cannot be negative']
  },
  currency: {
    type: String,
    default: 'NPR',
    enum: ['NPR']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: true
  }
}, {
  timestamps: true
});

// Update lastUpdated when rate changes
metalRateSchema.pre('save', function(next) {
  if (this.isModified('ratePerTola')) {
    this.lastUpdated = new Date();
  }
  next();
});

module.exports = mongoose.model('MetalRate', metalRateSchema); 