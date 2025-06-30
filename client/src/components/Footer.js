import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gradient-to-r from-gold-800 via-gold-700 to-gold-800 text-white">
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
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
            <p>📍 Ramjanki Path, Biratnagar, Nepal</p>
            <p>📞 +977 9842031752</p>
            <p>📞 +977 9815325777</p>
            <span className="block text-sm">Sunday - Friday, 10:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="border-t border-gold-600 mt-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-premium font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-3 mt-2">
              <a href="https://www.facebook.com/share/1BJ3BYHT2K/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/shree_subha_laxmi?igsh=cGVoc20xM3I2ZWNy&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@subha_laxmi_jewellery?_t=ZS-8xbzlzqC6Qm&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </div>
              </a>
              <a href="https://wa.me/9807313993" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" />
              </a>
            </div>
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