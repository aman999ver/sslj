const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientUser',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  billingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'ESEWA', 'BANK_TRANSFER'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Verification Required'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paidAt: Date,
    paymentScreenshot: String, // URL to uploaded screenshot
    paymentNotes: String, // Additional notes about payment
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    verifiedAt: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancellationCharge: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((total, item) => {
    return total + item.totalPrice;
  }, 0);
  
  this.totalAmount = this.subtotal + this.tax + this.shippingCost;
  return this;
};

// Update order status
orderSchema.methods.updateStatus = function(status) {
  this.orderStatus = status;
  
  if (status === 'Delivered') {
    this.deliveredAt = new Date();
  }
  
  return this;
};

// Update payment status
orderSchema.methods.updatePaymentStatus = function(status, paymentDetails = {}) {
  this.paymentStatus = status;
  
  if (status === 'Paid') {
    this.paymentDetails = {
      ...this.paymentDetails,
      ...paymentDetails,
      paidAt: new Date()
    };
  }
  
  return this;
};

// Verify payment
orderSchema.methods.verifyPayment = function(adminUserId, notes = '') {
  this.paymentStatus = 'Paid';
  this.paymentDetails = {
    ...this.paymentDetails,
    verifiedBy: adminUserId,
    verifiedAt: new Date(),
    paymentNotes: notes
  };
  
  return this;
};

module.exports = mongoose.model('Order', orderSchema); 