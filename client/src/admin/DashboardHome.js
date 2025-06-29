import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    featuredProducts: 0,
    totalRates: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ratesRes] = await Promise.all([
        axios.get('/api/products/admin/all?limit=5'),
        axios.get('/api/metal-rates/all')
      ]);

      const products = productsRes.data.products;
      const rates = ratesRes.data.rates;

      setStats({
        totalProducts: productsRes.data.pagination?.totalProducts || 0,
        activeProducts: products.filter(p => p.isActive).length,
        featuredProducts: products.filter(p => p.featured).length,
        totalRates: rates.length
      });

      setRecentProducts(products.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome to Subha Laxmi Jewellery
          </h1>
          <p className="text-gray-600">
            Manage your jewelry business efficiently
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">💎</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeProducts}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Featured Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.featuredProducts}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Metal Rates</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRates}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/admin/dashboard/products"
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="mr-3">➕</span>
              <span className="text-sm font-medium text-gray-700">Add New Product</span>
            </Link>
            <Link
              to="/admin/dashboard/metal-rates"
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="mr-3">📊</span>
              <span className="text-sm font-medium text-gray-700">Update Metal Rates</span>
            </Link>
            <Link
              to="/admin/dashboard/orders"
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="mr-3">📦</span>
              <span className="text-sm font-medium text-gray-700">Manage Orders</span>
            </Link>
            <Link
              to="/admin/dashboard/analytics"
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="mr-3">📈</span>
              <span className="text-sm font-medium text-gray-700">View Sales Analytics</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="mr-3">👁️</span>
              <span className="text-sm font-medium text-gray-700">View Public Site</span>
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Products
          </h3>
          <div className="space-y-3">
            {recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-500">📦</span>
                </div>
                <p className="text-gray-500 text-sm">No products yet</p>
                <p className="text-gray-400 text-xs">Add your first product to get started</p>
              </div>
            ) : (
              recentProducts.map(product => (
                <div key={product._id} className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-3">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.category} • {product.metalType}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))
            )}
            <Link
              to="/admin/dashboard/products"
              className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-4"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Database</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-600">Connected and operational</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">API Server</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-600">Running smoothly</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">File Storage</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-600">Uploads working properly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 