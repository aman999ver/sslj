import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ClientLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('clientUser', JSON.stringify(data.user));
        localStorage.setItem('clientToken', data.token);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-2 sm:px-4 py-12 fade-in-section">
      <div className="bg-white rounded-2xl shadow-gold border-4 border-gold-400 p-6 sm:p-10 w-full max-w-md shimmer-gold">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Subha Laxmi Logo" className="w-20 h-20 mb-2" />
          <h2 className="text-3xl font-luxury font-bold text-luxury-brown mb-2 text-center">Customer Login</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-2 opacity-70"></div>
        </div>
        {error && <div className="mb-4 text-red-600 text-center font-luxury">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <div className="flex justify-end mt-1">
              <Link to="/forgot-password" className="text-gold-600 hover:underline font-luxury text-sm font-semibold">Forgot password?</Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-luxury-brown text-white py-3 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition text-lg mt-2"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center font-luxury">
          <span className="text-luxury-brown/80">Don't have an account? </span>
          <Link to="/register" className="text-gold-600 hover:underline font-semibold">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginPage; 