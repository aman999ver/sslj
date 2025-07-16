const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    default: 'Gold'
  },
  metalType: {
    type: String,
    required: [true, 'Metal type is required'],
    enum: ['24K', '22K', 'Silver'],
    default: '24K'
  },
  weight: {
    type: Number,
    required: [true, 'Weight in grams is required'],
    min: [0.1, 'Weight must be at least 0.1 grams']
  },
  lossPercentage: {
    type: Number,
    default: 0,
    min: [0, 'Loss percentage cannot be negative'],
    max: [50, 'Loss percentage cannot exceed 50%']
  },
  makingCharge: {
    type: Number,
    required: [true, 'Making charge is required'],
    min: [0, 'Making charge cannot be negative']
  },
  images: [{
    type: String,
    required: [true, 'At least one product image is required']
  }],
  price: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  sku: {
    type: String,
    unique: true,
    // Not required, will be auto-generated in pre-save hook
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientUser',
        required: true
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      adminReply: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

// Generate SKU before saving
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.sku = `SLJ-${this.metalType}-${timestamp}-${random}`;
  }
  next();
});

// Pre-save hook to calculate price
productSchema.pre('save', async function(next) {
  if (this.isModified('weight') || this.isModified('lossPercentage') || this.isModified('makingCharge') || this.isModified('metalType')) {
    try {
      const MetalRate = mongoose.model('MetalRate');
      const rates = await MetalRate.find({});
      
      const metalRatesMap = rates.reduce((map, rate) => {
        // Map metal types like '24K Gold' to just '24K' for lookup
        const key = rate.metalType.startsWith('24K') ? '24K' 
                  : rate.metalType.startsWith('22K') ? '22K'
                  : 'Silver';
        map[key] = rate.ratePerTola;
        return map;
      }, {});
      
      this.price = this.calculatePrice(metalRatesMap);
    } catch (error) {
      console.error('Error calculating product price:', error);
      // Decide if you want to block saving or not. Here, we'll let it save with a potentially stale price.
    }
  }
  next();
});

// Calculate price based on metal rates
productSchema.methods.calculatePrice = function(metalRates) {
  const rate = metalRates[this.metalType];
  if (!rate) return 0;
  
  const weightWithLoss = this.weight + (this.weight * this.lossPercentage / 100);
  const weightInTola = weightWithLoss / 11.664; // Convert grams to tola
  const metalCost = weightInTola * rate;
  
  return Math.round(metalCost + this.makingCharge);
};

module.exports = mongoose.model('Product', productSchema); 