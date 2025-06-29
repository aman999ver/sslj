const MetalRate = require('../models/MetalRate');
const Product = require('../models/Product');

// Get current metal rates (public)
const getCurrentRates = async (req, res) => {
  try {
    const rates = await MetalRate.find({ isActive: true })
      .sort({ metalType: 1 });

    res.json({
      success: true,
      rates
    });

  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all metal rates (admin)
const getAllRates = async (req, res) => {
  try {
    const rates = await MetalRate.find()
      .populate('updatedBy', 'username email')
      .sort({ metalType: 1 });

    res.json({
      success: true,
      rates
    });

  } catch (error) {
    console.error('Get all rates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update metal rate (admin)
const updateRate = async (req, res) => {
  try {
    const { metalType, ratePerTola } = req.body;

    if (!metalType || !ratePerTola) {
      return res.status(400).json({ message: 'Metal type and rate are required' });
    }

    if (ratePerTola <= 0) {
      return res.status(400).json({ message: 'Rate must be greater than 0' });
    }

    // Find existing rate or create new one
    let rate = await MetalRate.findOne({ metalType });

    if (rate) {
      // Update existing rate
      rate.ratePerTola = parseFloat(ratePerTola);
      rate.updatedBy = req.user._id;
      await rate.save();
    } else {
      // Create new rate
      rate = new MetalRate({
        metalType,
        ratePerTola: parseFloat(ratePerTola),
        updatedBy: req.user._id
      });
      await rate.save();
    }

    // Recalculate prices for all products with this metal type
    const products = await Product.find({ 
      metalType, 
      isActive: true 
    });

    const ratesMap = {};
    const allRates = await MetalRate.find({ isActive: true });
    allRates.forEach(r => {
      ratesMap[r.metalType] = r.ratePerTola;
    });

    // Update product prices in bulk
    const updatePromises = products.map(product => {
      const newPrice = product.calculatePrice(ratesMap);
      return Product.findByIdAndUpdate(product._id, { price: newPrice });
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Metal rate updated successfully',
      rate,
      productsUpdated: products.length
    });

  } catch (error) {
    console.error('Update rate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update multiple rates at once (admin)
const updateMultipleRates = async (req, res) => {
  try {
    const { rates } = req.body;

    if (!rates || !Array.isArray(rates)) {
      return res.status(400).json({ message: 'Rates array is required' });
    }

    const updatePromises = rates.map(async (rateData) => {
      const { metalType, ratePerTola } = rateData;

      if (!metalType || !ratePerTola || ratePerTola <= 0) {
        throw new Error(`Invalid data for ${metalType}`);
      }

      let rate = await MetalRate.findOne({ metalType });

      if (rate) {
        rate.ratePerTola = parseFloat(ratePerTola);
        rate.updatedBy = req.user._id;
        return rate.save();
      } else {
        rate = new MetalRate({
          metalType,
          ratePerTola: parseFloat(ratePerTola),
          updatedBy: req.user._id
        });
        return rate.save();
      }
    });

    await Promise.all(updatePromises);

    // Recalculate all product prices
    const allRates = await MetalRate.find({ isActive: true });
    const ratesMap = {};
    allRates.forEach(rate => {
      ratesMap[rate.metalType] = rate.ratePerTola;
    });

    const allProducts = await Product.find({ isActive: true });
    const productUpdatePromises = allProducts.map(product => {
      const newPrice = product.calculatePrice(ratesMap);
      return Product.findByIdAndUpdate(product._id, { price: newPrice });
    });

    await Promise.all(productUpdatePromises);

    res.json({
      success: true,
      message: 'All metal rates updated successfully',
      ratesUpdated: rates.length,
      productsUpdated: allProducts.length
    });

  } catch (error) {
    console.error('Update multiple rates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get rate history (admin)
const getRateHistory = async (req, res) => {
  try {
    const { metalType, limit = 50 } = req.query;

    const query = {};
    if (metalType) query.metalType = metalType;

    const rates = await MetalRate.find(query)
      .populate('updatedBy', 'username email')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      rates
    });

  } catch (error) {
    console.error('Get rate history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Initialize default rates (admin)
const initializeRates = async (req, res) => {
  try {
    const defaultRates = [
      { metalType: '24K', ratePerTola: 192800 },
      { metalType: '22K', ratePerTola: 176400 },
      { metalType: 'Silver', ratePerTola: 2800 }
    ];

    const existingRates = await MetalRate.find();
    
    if (existingRates.length > 0) {
      return res.status(400).json({ 
        message: 'Rates already exist. Use update endpoint to modify rates.' 
      });
    }

    const createPromises = defaultRates.map(rateData => {
      const rate = new MetalRate({
        ...rateData,
        updatedBy: req.user._id
      });
      return rate.save();
    });

    await Promise.all(createPromises);

    res.json({
      success: true,
      message: 'Default metal rates initialized successfully',
      rates: defaultRates
    });

  } catch (error) {
    console.error('Initialize rates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCurrentRates,
  getAllRates,
  updateRate,
  updateMultipleRates,
  getRateHistory,
  initializeRates
}; 