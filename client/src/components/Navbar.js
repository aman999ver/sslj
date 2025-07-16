import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categories = [
  { name: 'Rings', path: '/products?category=Rings' },
  { name: 'Earrings', path: '/products?category=Earrings' },
  { name: 'Necklaces', path: '/products?category=Necklaces' },
  { name: 'Bracelets', path: '/products?category=Bracelets' },
  { name: 'Bangles', path: '/products?category=Bangles' },
  { name: 'Pendants', path: '/products?category=Pendants' },
];

const collections = [
  { name: 'Wedding', path: '/products?collection=Wedding' },
  { name: 'Festive', path: '/products?collection=Festive' },
  { name: 'Everyday', path: '/products?collection=Everyday' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const hasScrolledRef = useRef(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cart } = useCart();
  const navbarRef = useRef(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const bottomNavRef = useRef(null);
  const closeCategoryTimeout = useRef();
  const closeCollectionTimeout = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuCloseTimeout = useRef();

  useEffect(() => {
    // Show both sections at top, hide second section when scrolled, show again at top
    setIsScrolled(window.scrollY > 0);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('clientUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    if (bottomNavRef.current) {
      const rect = bottomNavRef.current.getBoundingClientRect();
      setDropdownTop(rect.top + rect.height + window.scrollY);
    }
  }, [isScrolled]);

  // Close menu on route change (mobile)
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('clientUser');
    localStorage.removeItem('clientToken');
    setUser(null);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleAvatarClick = () => {
    setMenuOpen((open) => !open);
  };

  // Desktop menu open/close with delay
  const handleMenuMouseEnter = () => {
    if (menuCloseTimeout.current) clearTimeout(menuCloseTimeout.current);
    setMenuOpen(true);
  };
  const handleMenuMouseLeave = () => {
    menuCloseTimeout.current = setTimeout(() => setMenuOpen(false), 250);
  };

  return (
    <nav ref={navbarRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-luxury ${
      isScrolled ? 'bg-luxury-bright/95 shadow-lg' : 'bg-luxury-bright'
    }`}>
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16 md:h-20 border-b border-gold-200">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Subha Laxmi Jewellery" className="h-10 md:h-12 w-auto" />
          <span className="text-xl md:text-2xl font-luxury font-bold text-luxury-brown tracking-wide">Subha Laxmi Jewellery</span>
        </Link>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8 max-w-xl items-center bg-luxury-bright border-2 border-luxury-brown rounded-xl px-2 py-1 shadow-sm">
          <input
            type="text"
            placeholder="Search jewellery..."
            className="bg-transparent outline-none px-0 py-0 text-luxury-brown font-medium w-full placeholder-luxury-brown text-base h-6"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="ml-2 px-2 py-0 rounded-lg border-luxury-brown text-luxury-brown font-semibold hover:bg-luxury-brown hover:text-white transition-colors text-base shadow-sm h-7">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
          </button>
        </form>
        {/* User/Login/Cart */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/cart" className="relative group">
            <div className="w-8 h-8 bg-luxury-bright rounded-full flex items-center justify-center text-luxury-brown hover:bg-luxury-brown hover:text-white transition-colors duration-200 shadow-sm border-2 border-luxury-brown">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            {cart.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury-brown text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white">
                {cart.itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative">
              {/* Mobile: Avatar + Name, click to open menu */}
              <button
                className="flex items-center md:hidden bg-luxury-bright text-luxury-brown px-2 py-1 rounded-xl font-luxury font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                onClick={handleAvatarClick}
                aria-label="User menu"
              >
                <span className="w-8 h-8 rounded-full bg-gold-200 flex items-center justify-center text-lg font-bold text-luxury-brown">
                  {user.image ? (
                    <img src={user.image} alt={user.firstName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    user.firstName?.[0]?.toUpperCase() || 'U'
                  )}
                </span>
              </button>
              {/* Desktop: hover to open menu */}
              <div
                className="hidden md:block relative group focus-within:z-50"
                tabIndex={0}
                onMouseEnter={handleMenuMouseEnter}
                onMouseLeave={handleMenuMouseLeave}
              >
                <button className="bg-luxury-bright text-luxury-brown px-4 py-0 rounded-xl font-luxury font-semibold focus:outline-none focus:ring-2 focus:ring-gold-400 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gold-200 flex items-center justify-center text-lg font-bold text-luxury-brown mr-2">
                    {user.image ? (
                      <img src={user.image} alt={user.firstName} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      user.firstName?.[0]?.toUpperCase() || 'U'
                    )}
                  </span>
                  Hi, {user.firstName}
                </button>
                {/* Dropdown menu (desktop) */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-luxury-bright border border-gold-200 rounded-md shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 text-gold-700 hover:bg-tanishq-redLight hover:text-tanishq-red rounded transition-colors"
                      onClick={() => navigate('/profile')}
                    >
                      Profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-gold-700 hover:bg-tanishq-redLight hover:text-tanishq-red rounded transition-colors"
                      onClick={() => navigate('/orders')}
                    >
                      Orders
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-gold-700 hover:bg-tanishq-redLight hover:text-tanishq-red rounded transition-colors"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              {/* Mobile: dropdown menu (click to open) */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-luxury-bright border border-gold-200 rounded-md shadow-lg z-50 md:hidden">
                  <button
                    className="block w-full text-left px-4 py-2 text-gold-700 hover:bg-tanishq-redLight hover:text-tanishq-red rounded transition-colors"
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gold-700 hover:bg-tanishq-redLight hover:text-tanishq-red rounded transition-colors"
                    onClick={() => { setMenuOpen(false); navigate('/orders'); }}
                  >
                    Orders
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gold-700 hover:bg-tanishq-redLight hover:text-tanishq-red rounded transition-colors"
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-luxury-bright text-luxury-brown px-4 py-0 rounded-xl font-luxury font-semibold shadow-sm border-2 border-luxury-brown hover:bg-luxury-brown hover:text-white transition-colors text-base h-8"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      {/* Bottom Section: Navigation (hide on scroll, animated) */}
      <div
        ref={bottomNavRef}
        className={`relative
          max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-center 
          space-x-2 md:space-x-6
          text-sm md:text-base
          transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'max-h-0 min-h-0 opacity-0 -translate-y-4 pointer-events-none'
            : 'max-h-32 min-h-[4rem] opacity-100 translate-y-0'}
        `}
      >
        <Link to="/" className="text-luxury-brown hover:text-tanishq-red font-semibold text-base px-2 py-1 transition-colors">Home</Link>
        {/* Jewellery Dropdown */}
        <div
          className="relative group"
          onMouseEnter={() => {
            clearTimeout(closeCategoryTimeout.current);
            setIsCategoryOpen(true);
          }}
          onMouseLeave={() => {
            closeCategoryTimeout.current = setTimeout(() => setIsCategoryOpen(false), 200);
          }}
        >
          <button
            className="text-luxury-brown hover:text-tanishq-red font-semibold text-base px-2 py-1 transition-colors"
            onClick={() => navigate('/products')}
            type="button"
          >
            Jewellery
          </button>
          {isCategoryOpen && (
            <div
              className="absolute top-full left-0 mt-4 w-56 bg-luxury-bright border border-gold-200 rounded shadow-lg py-2 z-50"
              onMouseEnter={() => {
                clearTimeout(closeCategoryTimeout.current);
                setIsCategoryOpen(true);
              }}
              onMouseLeave={() => {
                closeCategoryTimeout.current = setTimeout(() => setIsCategoryOpen(false), 200);
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="block px-4 py-2 text-luxury-brown hover:bg-tanishq-redLight hover:text-tanishq-red rounded transition-colors text-base"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Rates Link */}
        <Link to="/rates" className="text-luxury-brown hover:text-tanishq-red font-semibold text-base px-2 py-1 transition-colors">Rates</Link>
        <Link to="/about" className="text-luxury-brown hover:text-tanishq-red font-semibold text-base px-2 py-1 transition-colors">About</Link>
        <Link to="/contact" className="text-luxury-brown hover:text-tanishq-red font-semibold text-base px-2 py-1 transition-colors">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar; 