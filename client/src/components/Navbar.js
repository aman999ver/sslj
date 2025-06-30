import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check for client user in localStorage
    const storedUser = localStorage.getItem('clientUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('clientUser');
    localStorage.removeItem('clientToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-luxury' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
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
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <div className="w-8 h-8 bg-luxury-gradient rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              {cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="bg-luxury-gradient text-white px-6 py-2 rounded-full font-premium font-semibold shadow-gold hover:shadow-premium transition-all duration-300 transform hover:scale-105">
                  Hi, {user.firstName}
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gold-50"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gold-50"
                    onClick={() => navigate('/orders')}
                  >
                    Orders
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gold-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-luxury-gradient text-white px-6 py-2 rounded-full font-premium font-semibold shadow-gold hover:shadow-premium transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            )}
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
              
              {/* Mobile Cart Link */}
              <Link
                to="/cart"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-gold-500 hover:bg-gold-50 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Cart
                {cart.itemCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  <button
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gold-50"
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/profile'); }}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gold-50"
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/orders'); }}
                  >
                    Orders
                  </button>
                  <button
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gold-50"
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 bg-luxury-gradient text-white rounded-md font-premium font-semibold text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 