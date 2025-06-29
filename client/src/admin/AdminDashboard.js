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
import axios from 'axios';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, todaysSales: 0 });

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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                <span className="text-white text-sm font-semibold">SL</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Subha Laxmi Jewellery
                </h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
                <p className="text-xs text-gray-500">Email: {user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
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

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white px-3 py-2 rounded-md border border-gray-200">
                <span className="text-xs text-gray-500">Last updated:</span>
                <span className="text-xs font-medium text-gray-900 ml-2">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
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
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 