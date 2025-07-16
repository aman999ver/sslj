import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../pages/HomePage.css'; // for shimmer-gold, fade-in-section, luxury-bg-pattern

const RatesPage = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { addToCart, loading: cartLoading } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Always 2 on mobile, 4 on desktop
  const getPerView = () => (window.innerWidth >= 1024 ? 4 : 2);
  const [perView, setPerView] = useState(getPerView());

  useEffect(() => {
    const handleResize = () => {
      setPerView(getPerView());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - perView);
  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));

  // Touch/drag support
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < maxIndex) {
          setCurrentIndex(i => Math.min(maxIndex, i + 1)); // swipe left
        } else if (diff < 0 && currentIndex > 0) {
          setCurrentIndex(i => Math.max(0, i - 1)); // swipe right
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    axios.get('/api/metal-rates/current')
      .then(res => {
        setRates(res.data.rates || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load rates');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setProductsLoading(true);
    axios.get('/api/products?featured=true')
      .then(res => {
        setProducts(res.data.products || []);
        setProductsLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setProductsLoading(false);
      });
  }, []);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem('clientToken')) {
      window.alert('You need to login to add items to your cart. Redirecting to login page.');
      window.location.href = '/login';
      return;
    }
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Product added to cart successfully!');
    }
  };

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-lg border-2 border-luxury-brown hover:shadow-gold transition-all duration-300 flex flex-col overflow-hidden min-w-[150px] sm:min-w-[160px] max-w-xs w-full mx-auto md:mx-2 p-2 sm:p-4 md:p-6 lg:p-6">
      <Link to={`/products/${product._id}`} className="block flex-1">
        <div className="relative overflow-hidden bg-white rounded-t-2xl w-full h-28 sm:h-36 md:h-44 lg:h-52">
          <img 
            src={product.images[0]} 
            alt={product.name + ' - Subha Laxmi Jewellery'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-t-2xl"
          />
          {/* Badges Row */}
          <div className="absolute top-2 left-0 w-full flex justify-between px-2 sm:px-3 z-10 pointer-events-none">
            {/* Metal Type Badge */}
            {product.metalType && (
              <span
                className={
                  `px-2 sm:px-3 py-1 rounded-full text-xs font-luxury font-semibold border pointer-events-auto ` +
                  (product.metalType === '24K'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    : product.metalType === '22K'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : product.metalType === 'Silver'
                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                    : 'bg-gold-50 text-gold-700 border-gold-200')
                }
                style={{ minWidth: 36, textAlign: 'center' }}
              >
                {product.metalType}
              </span>
            )}
            {/* Featured Badge */}
            {product.featured && (
              <span className="bg-tanishq-redLight text-tanishq-red px-2 sm:px-3 py-1 rounded-full text-xs font-luxury font-semibold border border-tanishq-red pointer-events-auto">
                Featured
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-2xl"></div>
        </div>
        <div className="p-2 sm:p-4 flex flex-col gap-1 sm:gap-2">
          <h2 className="text-xs sm:text-base md:text-lg font-luxury font-semibold text-luxury-brown mb-1 truncate">
            {product.name}
          </h2>
          <div className="text-xs sm:text-sm text-luxury-brown mb-1">
            Weight: {product.weight}g
          </div>
          <div className="text-xs sm:text-sm text-luxury-brown mb-1">
            Category: {product.category}
          </div>
          <div className="mt-2 sm:mt-4 text-center">
            <span
              className="font-luxury font-extrabold text-base sm:text-xl md:text-2xl"
              style={{ color: '#B88900', textShadow: '0 1px 8px #f3e3b0, 0 0px 2px #fff' }}
            >
              NPR {product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
      {/* Add to Cart Button */}
      <div className="px-2 sm:px-4 pb-2 sm:pb-4">
        <button
          onClick={(e) => handleAddToCart(e, product._id)}
          disabled={cartLoading}
          className="w-full bg-luxury-brown text-white py-2 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-bright px-2 sm:px-4 md:px-8 py-12 luxury-bg-pattern pt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-luxury font-bold text-center text-luxury-brown mb-10">Current Metal Rates</h1>
        {loading ? (
          <div className="text-center text-luxury-brown font-luxury py-16">Loading rates...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-luxury py-16">{error}</div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-4 sm:gap-8 overflow-x-auto hide-scrollbar justify-center items-stretch fade-in-section mt-6 mb-12">
            {rates.map((rate, idx) => {
              let accent = 'from-gold-300 via-gold-500 to-gold-300';
              let textColor = 'text-gold-700';
              let borderColor = 'border-gold-300';
              let shadow = 'shadow-gold';
              if (rate.metalType === 'Silver') {
                accent = 'from-gray-300 via-gray-400 to-gray-300';
                textColor = 'text-gray-500';
                borderColor = 'border-gray-300';
                shadow = 'shadow-md';
              } else if (rate.metalType === 'Platinum') {
                accent = 'from-blue-200 via-blue-300 to-blue-200';
                textColor = 'text-blue-700';
                borderColor = 'border-blue-200';
                shadow = 'shadow-md';
              }
              return (
                <div key={rate.metalType} className={`relative bg-white rounded-2xl p-3 sm:p-6 min-w-[150px] sm:min-w-[200px] max-w-xs w-full flex flex-col items-center border-2 ${borderColor} ${shadow} transition-all duration-300 hover:scale-105 hover:shadow-xl mx-auto md:mx-1`} style={{animationDelay: `${idx * 0.1}s`}}>
                  <div className="absolute top-0 left-0 w-full h-1 shimmer-gold rounded-t-2xl"></div>
                  <div className="flex flex-col items-center justify-center mt-2 sm:mt-4 mb-1 sm:mb-2 w-full">
                    <div className="text-lg sm:text-2xl font-bold text-luxury-brown font-luxury mb-1 tracking-wide uppercase">{rate.metalType}</div>
                    <div className={`flex items-center justify-center text-base sm:text-3xl font-luxury font-bold ${textColor} mb-1 sm:mb-2`}>
                      NPR {rate.ratePerTola?.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-luxury-brown font-luxury mb-1 sm:mb-2 w-full text-center">
                    Updated: {rate.lastUpdated ? new Date(rate.lastUpdated).toLocaleString() : 'N/A'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Featured Products Section */}
        <h2 className="text-2xl md:text-3xl font-luxury font-bold text-center text-luxury-brown mb-8 mt-16">Featured Products</h2>
        {productsLoading ? (
          <div className="text-center text-luxury-brown font-luxury py-8">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-luxury-brown font-luxury py-8">No featured products found.</div>
        ) : (
          <div className="relative mb-8 fade-in-section">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="px-4 py-2 rounded-full bg-luxury-brown text-gold-400 font-bold shadow hover:bg-luxury-brown/90 disabled:opacity-40 disabled:cursor-not-allowed transition">&#8592;</button>
              <button onClick={handleNext} disabled={currentIndex >= maxIndex} className="px-4 py-2 rounded-full bg-luxury-brown text-gold-400 font-bold shadow hover:bg-luxury-brown/90 disabled:opacity-40 disabled:cursor-not-allowed transition">&#8594;</button>
            </div>
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {products.slice(currentIndex, currentIndex + perView).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatesPage; 