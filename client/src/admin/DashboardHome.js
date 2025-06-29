import React, { useEffect, useState } from 'react';
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

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-luxury animate-pulse">
              <div className="h-4 bg-gold-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gold-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-premium-gradient rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-elegant font-bold text-gold-800 mb-2">
          Welcome to Subha Laxmi Jewellery Admin
        </h1>
        <p className="text-gray-600 font-premium">
          Manage your products, metal rates, and monitor your luxury jewelry business
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-premium text-gray-600">Total Products</p>
              <p className="text-3xl font-elegant font-bold text-gold-600">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-premium text-gray-600">Active Products</p>
              <p className="text-3xl font-elegant font-bold text-green-600">{stats.activeProducts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-premium text-gray-600">Featured Products</p>
              <p className="text-3xl font-elegant font-bold text-ruby-600">{stats.featuredProducts}</p>
            </div>
            <div className="w-12 h-12 bg-ruby-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-premium text-gray-600">Metal Rates</p>
              <p className="text-3xl font-elegant font-bold text-royal-600">{stats.totalRates}</p>
            </div>
            <div className="w-12 h-12 bg-royal-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
          <h3 className="text-xl font-elegant font-bold text-gold-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/dashboard/products"
              className="flex items-center space-x-3 p-3 bg-gold-50 rounded-lg hover:bg-gold-100 transition-colors"
            >
              <span className="text-xl">➕</span>
              <span className="font-premium">Add New Product</span>
            </Link>
            <Link
              to="/admin/dashboard/metal-rates"
              className="flex items-center space-x-3 p-3 bg-royal-50 rounded-lg hover:bg-royal-100 transition-colors"
            >
              <span className="text-xl">📊</span>
              <span className="font-premium">Update Metal Rates</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center space-x-3 p-3 bg-ruby-50 rounded-lg hover:bg-ruby-100 transition-colors"
            >
              <span className="text-xl">👁️</span>
              <span className="font-premium">View Public Site</span>
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
          <h3 className="text-xl font-elegant font-bold text-gold-800 mb-4">Recent Products</h3>
          <div className="space-y-3">
            {recentProducts.length === 0 ? (
              <p className="text-gray-500 font-premium text-center py-4">No products yet</p>
            ) : (
              recentProducts.map(product => (
                <div key={product._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-premium font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category} • {product.metalType}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-premium ${
                    product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))
            )}
            <Link
              to="/admin/dashboard/products"
              className="block text-center text-gold-600 font-premium hover:text-gold-700 transition-colors"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 