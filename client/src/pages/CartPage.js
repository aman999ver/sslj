import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, loading, addToCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Featured products state
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    setFeaturedLoading(true);
    fetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => {
        setFeatured(data.products || []);
        setFeaturedLoading(false);
      })
      .catch(() => {
        setFeatured([]);
        setFeaturedLoading(false);
      });
  }, []);

  const [addLoadingId, setAddLoadingId] = useState(null);
  const handleAddFeaturedToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem('clientToken')) {
      window.alert('You need to login to add items to your cart. Redirecting to login page.');
      navigate('/login');
      return;
    }
    setAddLoadingId(productId);
    const success = await addToCart(productId, 1);
    setAddLoadingId(null);
    if (success) {
      alert('Product added to cart successfully!');
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gold-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some beautiful jewelry to your cart!</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white luxury-bg-pattern py-10 mt-12">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-luxury font-bold text-luxury-brown">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 font-medium border border-red-200 rounded-lg px-4 py-2 bg-white shadow-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-luxury-brown p-1 sm:p-3 md:p-4">
              {cart.items.map((item, idx) => (
                <div
                  key={item.product?._id || item.product}
                  className={`flex items-center gap-2 xs:gap-3 p-1 xs:p-2 mb-2 last:mb-0 rounded-lg transition-all duration-200 bg-white/90 hover:bg-gold-50 shadow-sm ${idx !== cart.items.length - 1 ? 'border-b border-gold-100' : ''}`}
                >
                  {/* Product Image */}
                  <img
                    src={item.product?.images?.[0] || '/placeholder-image.jpg'}
                    alt={item.product?.name || 'Product'}
                    className="w-12 h-12 xs:w-16 xs:h-16 object-cover rounded-lg border border-gold-100 bg-white shadow-sm flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-luxury font-semibold text-luxury-brown text-xs xs:text-sm truncate">{item.product?.name || 'Product'}</h3>
                    <div className="flex flex-wrap gap-x-2 text-[10px] xs:text-xs text-luxury-brown/80 font-luxury">
                      <span>{item.product?.category || 'Category'}</span>
                      <span>|</span>
                      <span>{item.product?.metalType || 'Metal'}</span>
                      <span>|</span>
                      <span>Weight: {item.product?.weight || 0}g</span>
                    </div>
                    <p className="font-semibold text-gold-600 font-luxury text-xs xs:text-sm mt-0.5">NPR {item.price?.toLocaleString() || 0}</p>
                  </div>
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1 xs:space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.product?._id || item.product, item.quantity - 1)}
                      className="w-6 h-6 xs:w-7 xs:h-7 bg-gold-100 rounded-full flex items-center justify-center hover:bg-gold-200 text-gold-700 font-bold shadow-sm text-xs"
                    >
                      -
                    </button>
                    <span className="w-6 xs:w-8 text-center font-semibold font-luxury text-xs xs:text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product?._id || item.product, item.quantity + 1)}
                      className="w-6 h-6 xs:w-7 xs:h-7 bg-gold-100 rounded-full flex items-center justify-center hover:bg-gold-200 text-gold-700 font-bold shadow-sm text-xs"
                    >
                      +
                    </button>
                  </div>
                  {/* Total Price */}
                  <div className="text-right min-w-[60px]">
                    <p className="font-semibold text-luxury-brown font-luxury text-xs xs:text-sm">NPR {((item.price || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                  {/* Remove Button */}
                  <div className="flex-shrink-0 w-14 xs:w-16">
                    <button
                      onClick={() => handleRemoveItem(item.product?._id || item.product)}
                      className="w-full bg-luxury-brown text-white py-1 rounded-lg font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition-all duration-300 text-xs xs:text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-luxury-brown p-8 sticky top-8">
              <h2 className="text-2xl font-luxury font-bold text-luxury-brown mb-6">Order Summary</h2>
              <div className="space-y-4 font-luxury">
                <div className="flex justify-between">
                  <span className="text-luxury-brown/80">Items ({cart.itemCount})</span>
                  <span className="font-semibold text-luxury-brown">NPR {cart.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-brown/80">Shipping</span>
                  <span className="font-semibold text-luxury-brown">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-luxury-brown/80">Tax</span>
                  <span className="font-semibold text-luxury-brown">NPR 0</span>
                </div>
                <hr className="my-4 border-gold-100" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-gold-600">NPR {cart.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-luxury-brown text-white py-4 rounded-xl font-luxury font-semibold hover:bg-luxury-brown/90 transition mt-8 text-lg shadow"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Featured Items Section */}
      <div className="mt-16">
        <h2 className="text-2xl md:text-3xl font-luxury font-bold text-center text-luxury-brown mb-8">Featured Items</h2>
        {featuredLoading ? (
          <div className="text-center text-luxury-brown font-luxury py-8">Loading featured items...</div>
        ) : featured.length === 0 ? (
          <div className="text-center text-luxury-brown font-luxury py-8">No featured items found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featured.map(product => (
              <div key={product._id} className="group bg-white rounded-2xl shadow-lg border-2 border-luxury-brown hover:shadow-gold transition-all duration-300 flex flex-col overflow-hidden">
                <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded-t-2xl" />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-luxury font-semibold text-luxury-brown text-base mb-1 truncate">{product.name}</h3>
                  <div className="text-xs text-luxury-brown mb-1">Weight: {product.weight}g</div>
                  <div className="text-xs text-luxury-brown mb-1">Category: {product.category}</div>
                  <div className="mt-2 text-center">
                    <span className="font-luxury font-extrabold text-lg" style={{ color: '#B88900', textShadow: '0 1px 8px #f3e3b0, 0 0px 2px #fff' }}>
                      NPR {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={e => handleAddFeaturedToCart(e, product._id)}
                    disabled={addLoadingId === product._id}
                    className="w-full bg-luxury-brown text-white py-2 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                  >
                    {addLoadingId === product._id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 