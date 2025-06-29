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
            <p>📍 Ramjanki Path, Biratnagar, Nepal</p>
            <p>📞 +977 9842031752</p>
            <p>📞 +977 9815325777</p>
            <p>🕒 Mon-Sat: 10AM-8PM</p>
            <p>🕒 Sun: 11AM-6PM</p>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="border-t border-gold-600 mt-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-premium font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/subhalaxmijewellery" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/subhalaxmijewellery" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.796-1.418-1.947-1.418-3.244s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244zm-7.718-6.62c-1.297 0-2.448.49-3.323 1.297-.928.875-1.418 2.026-1.418 3.323s.49 2.448 1.418 3.323c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.928-.875 1.418-2.026 1.418-3.323s-.49-2.448-1.418-3.323c-.875-.807-2.026-1.297-3.323-1.297z"/>
                </svg>
              </a>
              <a 
                href="https://tiktok.com/@subhalaxmijewellery" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/@subhalaxmijewellery" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/9779842031752" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
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