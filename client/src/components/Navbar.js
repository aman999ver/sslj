import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-luxury' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-luxury-gradient rounded-full flex items-center justify-center shadow-gold">
              <span className="text-white font-elegant text-xl">SL</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-elegant font-bold bg-luxury-gradient bg-clip-text text-transparent">
                Subha Laxmi
              </h1>
              <p className="text-xs font-premium text-gray-600 -mt-1">Jewellery</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-premium font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-gold-600 border-b-2 border-gold-500'
                    : 'text-gray-700 hover:text-gold-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="bg-luxury-gradient text-white px-6 py-2 rounded-full font-premium font-semibold shadow-gold hover:shadow-premium transition-all duration-300 transform hover:scale-105"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gold-500 focus:outline-none focus:text-gold-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md shadow-luxury rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md font-premium font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-gold-600 bg-gold-50'
                      : 'text-gray-700 hover:text-gold-500 hover:bg-gold-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admin/login"
                className="block px-3 py-2 bg-luxury-gradient text-white rounded-md font-premium font-semibold text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 