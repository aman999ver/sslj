const Product = require('../models/Product');
const MetalRate = require('../models/MetalRate');

// Get all products (public)
const getAllProducts = async (req, res) => {
  try {
    const { category, metalType, search, page = 1, limit = 12 } = req.query;
    
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (metalType) query.metalType = metalType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    // Get current metal rates
    const metalRates = await MetalRate.find({ isActive: true });
    const ratesMap = {};
    metalRates.forEach(rate => {
      ratesMap[rate.metalType] = rate.ratePerTola;
    });

    // Calculate prices for each product
    const productsWithPrices = products.map(product => {
      const productObj = product.toObject();
      productObj.price = product.calculatePrice(ratesMap);
      return productObj;
    });

    res.json({
      success: true,
      products: productsWithPrices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product (public)
const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get current metal rates
    const metalRates = await MetalRate.find({ isActive: true });
    const ratesMap = {};
    metalRates.forEach(rate => {
      ratesMap[rate.metalType] = rate.ratePerTola;
    });

    const productObj = product.toObject();
    productObj.price = product.calculatePrice(ratesMap);

    res.json({
      success: true,
      product: productObj
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured products (public)
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      featured: true 
    }).limit(8);

    // Get current metal rates
    const metalRates = await MetalRate.find({ isActive: true });
    const ratesMap = {};
    metalRates.forEach(rate => {
      ratesMap[rate.metalType] = rate.ratePerTola;
    });

    // Calculate prices
    const productsWithPrices = products.map(product => {
      const productObj = product.toObject();
      productObj.price = product.calculatePrice(ratesMap);
      return productObj;
    });

    res.json({
      success: true,
      products: productsWithPrices
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create product (admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      metalType,
      weight,
      lossPercentage = 0,
      makingCharge,
      featured = false
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !metalType || !weight || !makingCharge) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Handle image uploads
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one product image is required' });
    }

    const product = new Product({
      name,
      description,
      category,
      metalType,
      weight: parseFloat(weight),
      lossPercentage: parseFloat(lossPercentage),
      makingCharge: parseFloat(makingCharge),
      images,
      featured
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };
    
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = newImages;
    }

    // Convert numeric fields
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);
    if (updateData.lossPercentage) updateData.lossPercentage = parseFloat(updateData.lossPercentage);
    if (updateData.makingCharge) updateData.makingCharge = parseFloat(updateData.makingCharge);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete - set isActive to false
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products for admin (including inactive)
const getAdminProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments();

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      }
    });

  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts
}; 