import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const categories = [
  { name: 'Gold', icon: '💛', color: 'gold', gradient: 'bg-luxury-gradient' },
  { name: 'Silver', icon: '🤍', color: 'gray-300', gradient: 'bg-gradient-to-r from-gray-300 to-gray-400' },
  { name: 'Rings', icon: '💍', color: 'ruby', gradient: 'bg-gradient-to-r from-ruby-400 to-ruby-600' },
  { name: 'Necklaces', icon: '📿', color: 'royal', gradient: 'bg-gradient-to-r from-royal-400 to-royal-600' },
];

const HomePage = () => {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    axios.get('/api/metal-rates/current')
      .then(res => setRates(res.data.rates))
      .catch(() => setRates([]));
  }, []);

  return (
    <div className="bg-luxury-cream">
      {/* Hero Banner */}
      <section className="relative bg-premium-gradient py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-7xl font-elegant font-bold text-gold-800 drop-shadow-lg mb-6 animate-float">
            Subha Laxmi Jewellery
          </h1>
          <p className="text-2xl md:text-3xl text-ruby-700 font-premium mb-8 font-light">
            Nepal's Premier Luxury Jewellery Destination
          </p>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto font-premium">
            Discover exquisite craftsmanship and timeless elegance in every piece
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-luxury-gradient text-white font-bold px-10 py-4 rounded-full shadow-premium hover:shadow-luxury transition-all duration-300 transform hover:scale-105"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-elegant text-center mb-4 text-gold-800">Our Collections</h2>
        <p className="text-center text-gray-600 mb-12 font-premium">Discover our handcrafted luxury pieces</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map(cat => (
            <Link 
              key={cat.name} 
              to={`/products?category=${cat.name}`} 
              className="group relative overflow-hidden rounded-2xl shadow-luxury hover:shadow-premium transition-all duration-500 transform hover:scale-105"
            >
              <div className={`h-48 ${cat.gradient} flex flex-col items-center justify-center relative overflow-hidden`}>
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <span className="text-xl font-premium font-semibold text-white drop-shadow-lg">{cat.name}</span>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Metal Rates */}
      <section className="py-20 bg-gradient-to-br from-gold-50 to-luxury-champagne">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-elegant text-center mb-4 text-gold-800">Live Metal Rates</h2>
          <p className="text-center text-gray-600 mb-12 font-premium">Current market rates per Tola (NPR)</p>
          <div className="flex flex-wrap justify-center gap-8">
            {rates.length === 0 ? (
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="w-32 h-32 bg-gold-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gold-200 rounded w-24 mx-auto"></div>
                </div>
                <span className="text-gray-500 font-premium">Loading rates...</span>
              </div>
            ) : rates.map(rate => (
              <div key={rate.metalType} className="bg-white rounded-2xl px-8 py-6 shadow-luxury hover:shadow-premium transition-all duration-300 transform hover:scale-105 border border-gold-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-600 mb-2">{rate.metalType}</div>
                  <div className="text-3xl font-premium font-bold text-royal-700 mb-2">
                    NPR {rate.ratePerTola.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 font-premium">
                    Updated: {new Date(rate.lastUpdated).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-elegant text-center mb-12 text-gold-800">Why Choose Subha Laxmi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-premium font-semibold mb-2 text-gold-700">Premium Quality</h3>
              <p className="text-gray-600 font-premium">Handcrafted with the finest materials and attention to detail</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-premium font-semibold mb-2 text-gold-700">Heritage Craftsmanship</h3>
              <p className="text-gray-600 font-premium">Generations of traditional Nepali jewelry making expertise</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-premium font-semibold mb-2 text-gold-700">Live Pricing</h3>
              <p className="text-gray-600 font-premium">Transparent pricing based on current market rates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 