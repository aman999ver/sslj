import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { adminAuth } from '../utils/auth';
import ProductManagement from './ProductManagement';
import MetalRatesManagement from './MetalRatesManagement';
import DashboardHome from './DashboardHome';
import OrderManagement from './OrderManagement';
import SalesAnalytics from './SalesAnalytics';
import PaymentVerification from './PaymentVerification';
import CategoryManagement from './CategoryManagement';
import ClientManagement from './ClientManagement';
import InquiryManagement from './InquiryManagement';
import PaymentMethodsManagement from './PaymentMethodsManagement';
import BannerManagement from './BannerManagement';
import axios from 'axios';
import { HiMenu } from 'react-icons/hi';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, todaysSales: 0 });
  const [selectedSection, setSelectedSection] = useState('dashboard'); // Default to dashboard
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    try {
      const result = await adminAuth.checkAuth();
      
      if (result.isAuthenticated) {
        setUser(result.user);
      } else {
        window.location.href = '/admin/login';
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total products
      const productsRes = await axios.get('/api/products/admin/all');
      const products = productsRes.data.pagination?.totalProducts || 0;

      // Get sales analytics for today
      const today = new Date();
      const startDate = today.toISOString().slice(0, 10);
      const endDate = startDate;
      const analyticsRes = await axios.get(`/api/admin/orders/analytics/sales?startDate=${startDate}&endDate=${endDate}`);
      const analytics = analyticsRes.data.analytics;
      const pendingOrders = analytics.statusBreakdown?.Pending || 0;
      const todaysSales = analytics.totalRevenue || 0;

      setStats({ products, pendingOrders, todaysSales });
    } catch (err) {
      setStats({ products: 0, pendingOrders: 0, todaysSales: 0 });
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Products', path: '/admin/dashboard/products', icon: '💎' },
    { name: 'Categories', path: '/admin/dashboard/categories', icon: '🏷️' },
    { name: 'Metal Rates', path: '/admin/dashboard/metal-rates', icon: '💰' },
    { name: 'Orders', path: '/admin/dashboard/orders', icon: '📦' },
    { name: 'Payment Verification', path: '/admin/dashboard/payment-verification', icon: '✅' },
    { name: 'Sales Analytics', path: '/admin/dashboard/analytics', icon: '📈' },
    { name: 'Clients', path: '/admin/dashboard/clients', icon: '👤' },
    { name: 'Inquiries', path: '/admin/dashboard/inquiries', icon: '❓' },
    { name: 'Payment Methods', path: '/admin/dashboard/payment-methods', icon: '🏦' },
    { name: 'Banner Management', path: '/admin/dashboard/banners', icon: '🎉' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center">
              {/* Hamburger for mobile */}
              <button className="md:hidden mr-2 text-2xl text-gray-700 focus:outline-none" onClick={() => setSidebarOpen(true)}>
                <HiMenu />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-2">
                <span className="text-white text-sm font-semibold">SL</span>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">Subha Laxmi Jewellery</h1>
                <p className="text-xs md:text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
                <p className="text-xs text-gray-500">Email: {user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">
              Navigation
            </h2>
            
            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Active Products</span>
                  <span className="text-sm font-medium text-gray-900">{stats.products}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Pending Orders</span>
                  <span className="text-sm font-medium text-gray-900">{stats.pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Today's Sales</span>
                  <span className="text-sm font-medium text-gray-900">₹{stats.todaysSales.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
        {/* Sidebar drawer for mobile, below navbar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex flex-col md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
            <aside className="relative w-full max-w-xs bg-white border-r border-gray-200 min-h-screen z-50 animate-slideInLeft mt-14">
              <div className="p-6 pt-2">
                <button className="absolute top-4 right-4 text-2xl text-gray-700" onClick={() => setSidebarOpen(false)}>&times;</button>
                <h2 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">Navigation</h2>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 w-full p-2 sm:p-3 md:p-6 max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div>
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
                {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-md border border-gray-200">
                <span className="text-xs text-gray-500">Last updated:</span>
                <span className="text-xs font-medium text-gray-900 ml-1">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-4 md:p-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/categories" element={<CategoryManagement />} />
              <Route path="/metal-rates" element={<MetalRatesManagement />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/payment-verification" element={<PaymentVerification />} />
              <Route path="/analytics" element={<SalesAnalytics />} />
              <Route path="/clients" element={<ClientManagement />} />
              <Route path="/inquiries" element={<InquiryManagement />} />
              <Route path="payment-methods" element={<PaymentMethodsManagement />} />
              <Route path="banners" element={<BannerManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 