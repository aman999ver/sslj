import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductManagement from './ProductManagement';
import MetalRatesManagement from './MetalRatesManagement';
import DashboardHome from './DashboardHome';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('slj_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Set default auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Verify token and get user info
    axios.get('/api/auth/profile')
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('slj_admin_token');
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('slj_admin_token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-premium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Products', path: '/admin/dashboard/products', icon: '💎' },
    { name: 'Metal Rates', path: '/admin/dashboard/metal-rates', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gold-800 to-gold-900 text-white shadow-luxury">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-luxury-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-elegant text-lg">SL</span>
            </div>
            <div>
              <h1 className="text-xl font-elegant font-bold">Admin Panel</h1>
              <p className="text-xs text-gold-200">Subha Laxmi Jewellery</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gold-600 text-white shadow-gold'
                    : 'text-gold-100 hover:bg-gold-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-premium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="mt-8 pt-6 border-t border-gold-600">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center">
                <span className="text-white font-premium text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-premium text-gold-100">{user?.username}</p>
                <p className="text-xs text-gold-300">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-ruby-600 text-white px-4 py-2 rounded-lg font-premium text-sm hover:bg-ruby-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gold-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-elegant text-gold-800">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            <div className="text-sm text-gray-600 font-premium">
              Welcome back, {user?.username}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/metal-rates" element={<MetalRatesManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 