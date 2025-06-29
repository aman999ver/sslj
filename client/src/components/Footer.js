import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gradient-to-r from-gold-800 via-gold-700 to-gold-800 text-white">
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-luxury-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-elegant text-sm">SL</span>
            </div>
            <div>
              <h3 className="text-xl font-elegant font-bold">Subha Laxmi Jewellery</h3>
              <p className="text-xs font-premium text-gold-200">Nepal's Luxury Jewellery</p>
            </div>
          </div>
          <p className="text-gold-100 font-premium mb-4">
            Proudly crafted by Subha Laxmi Jewellery, Nepal 🇳🇵
          </p>
          <p className="text-sm text-gold-200 font-premium">
            Discover the finest handcrafted jewelry with generations of traditional expertise.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-premium font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gold-200 hover:text-white transition-colors font-premium">Home</Link></li>
            <li><Link to="/products" className="text-gold-200 hover:text-white transition-colors font-premium">Products</Link></li>
            <li><Link to="/about" className="text-gold-200 hover:text-white transition-colors font-premium">About</Link></li>
            <li><Link to="/contact" className="text-gold-200 hover:text-white transition-colors font-premium">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-premium font-semibold mb-4">Contact</h4>
          <div className="space-y-2 text-sm text-gold-200 font-premium">
            <p>📍 Kathmandu, Nepal</p>
            <p>📞 +977-1-4XXXXXX</p>
            <p>✉️ info@subhalaxmi.com</p>
            <p>🕒 Mon-Sat: 10AM-7PM</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-600 mt-8 pt-8 text-center">
        <p className="text-sm text-gold-200 font-premium">
          © 2024 Subha Laxmi Jewellery. All rights reserved. | 
          <span className="ml-2">Crafted with ❤️ in Nepal</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer; 