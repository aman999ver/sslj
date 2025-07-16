import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-[#181818] text-luxury-cream font-luxury pt-12 pb-6 px-4 border-t-4 border-gold-700 shadow-gold">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gold-800 pb-10">
      {/* Brand */}
      <div className="md:col-span-1 flex flex-col items-start">
        <div className="flex items-center mb-4">
          <img src="/logo.png" alt="Subha Laxmi Jewellery" className="h-12 w-auto mr-3 rounded-lg shadow-gold" />
          <span className="text-3xl font-bold tracking-wide text-gold-400">Subha Laxmi</span>
        </div>
        <p className="text-gold-200 text-lg mb-2">Nepal's Luxury Jewellery</p>
        <p className="text-gold-500 text-base">Crafted with passion & tradition.</p>
      </div>
      {/* Quick Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gold-400">Quick Links</h4>
        <ul className="space-y-2">
          <li><Link to="/" className="text-luxury-cream hover:text-gold-400 transition-colors">Home</Link></li>
          <li><Link to="/products" className="text-luxury-cream hover:text-gold-400 transition-colors">Products</Link></li>
          <li><Link to="/about" className="text-luxury-cream hover:text-gold-400 transition-colors">About</Link></li>
          <li><Link to="/contact" className="text-luxury-cream hover:text-gold-400 transition-colors">Contact</Link></li>
        </ul>
      </div>
      {/* Customer Care */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gold-400">Customer Care</h4>
        <ul className="space-y-2">
          <li><Link to="/contact" className="text-luxury-cream hover:text-gold-400 transition-colors">FAQ</Link></li>
          <li><Link to="/contact" className="text-luxury-cream hover:text-gold-400 transition-colors">Store Locator</Link></li>
          <li><Link to="/contact" className="text-luxury-cream hover:text-gold-400 transition-colors">Jewellery Care</Link></li>
        </ul>
      </div>
      {/* Social & Contact */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-gold-400">Connect</h4>
        <div className="flex space-x-4 mb-3">
          {/* Facebook */}
          <a href="https://www.facebook.com/share/1BJ3BYHT2K/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.367-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
          </a>
          {/* Instagram */}
          <a href="https://www.instagram.com/shree_subha_laxmi?igsh=cGVoc20xM3I2ZWNy&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-6 h-6" />
            </div>
          </a>
          {/* WhatsApp */}
          <a href="https://wa.me/9807313993" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
          </a>
          {/* TikTok */}
          <a href="https://www.tiktok.com/@subha_laxmi_jewellery?_t=ZS-8xbzlzqC6Qm&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </div>
          </a>
        </div>
        <div className="text-gold-200 text-sm">
          <p className="text-gold-200">Ramjanki Path, Biratnagar, Nepal</p>
          <p className="text-gold-200">+977 9842031752</p>
          <p className="text-gold-200">Sunday - Friday, 10:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-gold-800">
      <p className="text-gold-500 text-xs">&copy; 2024 Subha Laxmi Jewellery. All rights reserved.</p>
      <span className="text-gold-500 text-xs mt-2 md:mt-0">Crafted with <span className='text-gold-400 font-bold'>49</span> in Nepal</span>
    </div>
  </footer>
);

export default Footer; 