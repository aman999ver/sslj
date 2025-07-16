const Cart = require('../models/Cart');
const Product = require('../models/Product');
const MetalRate = require('../models/MetalRate');

// Helper to create a map of current metal rates for calculations
const getMetalRatesMap = async () => {
  const rates = await MetalRate.find({});
  if (rates.length === 0) return {};
  
  return rates.reduce((map, rate) => {
    const key = rate.metalType.startsWith('24K') ? '24K' 
              : rate.metalType.startsWith('22K') ? '22K'
              : 'Silver';
    map[key] = rate.ratePerTola;
    return map;
  }, {});
};

// Get current user's cart and sync prices
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
      await cart.save();
      return res.json({ success: true, cart });
    }

    // Dynamically update prices in cart based on latest metal rates
    const metalRatesMap = await getMetalRatesMap();
    if (Object.keys(metalRatesMap).length > 0) {
      let needsSave = false;
      cart.items.forEach(item => {
        if (item.product) {
          const newPrice = item.product.calculatePrice(metalRatesMap);
          if (item.price !== newPrice) {
            item.price = newPrice;
            needsSave = true;
          }
        }
      });

      if (needsSave) {
        cart.calculateTotals();
        await cart.save();
      }
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error('Get Cart Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get cart' });
  }
};

// Add item to cart with dynamically calculated price
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Calculate current price on the fly
    const metalRatesMap = await getMetalRatesMap();
    const currentPrice = product.calculatePrice(metalRatesMap);

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }
    cart.addItem(productId, quantity, currentPrice);
    await cart.save();
    
    // Populate product data before sending response
    cart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Add to Cart Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    const metalRatesMap = await getMetalRatesMap();
    const product = await Product.findById(productId);
    if(product){
        const newPrice = product.calculatePrice(metalRatesMap);
        const item = cart.items.find(i => i.product.toString() === productId);
        if(item){
            item.price = newPrice
        }
    }
    cart.updateQuantity(productId, quantity);
    await cart.save();
    
    // Populate product data before sending response
    cart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update cart item' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    cart.removeItem(productId);
    await cart.save();
    
    // Populate product data before sending response
    cart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove from cart' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    cart.clearCart();
    await cart.save();
    
    // Populate product data before sending response
    cart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
}; 