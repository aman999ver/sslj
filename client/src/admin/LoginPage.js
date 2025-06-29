import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('slj_admin_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('slj_admin_token', res.data.token);
      
      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-premium">
            <span className="text-white font-elegant text-3xl">SL</span>
          </div>
          <h1 className="text-3xl font-elegant font-bold text-gold-800 mb-2">
            Subha Laxmi Jewellery
          </h1>
          <p className="text-gray-600 font-premium">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-luxury p-8 border border-gold-100">
          <h2 className="text-2xl font-elegant font-bold text-gold-800 mb-6 text-center">
            Admin Login
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-ruby-50 border border-ruby-200 rounded-lg">
              <p className="text-ruby-700 font-premium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-gold-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-gold-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gradient text-white font-premium font-semibold py-3 rounded-lg hover:shadow-premium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-gold-600 hover:text-gold-700 font-premium text-sm transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 font-premium text-sm">
            Secure access to Subha Laxmi Jewellery administration
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 