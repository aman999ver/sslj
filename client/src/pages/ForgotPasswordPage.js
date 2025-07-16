import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP & new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/client/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setSuccess('OTP sent to your email.');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/client/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
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
          <h2 className="text-3xl font-luxury font-bold text-luxury-brown mb-2 text-center">Forgot Password</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-2 opacity-70"></div>
        </div>
        {error && <div className="mb-4 text-red-600 text-center font-luxury">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center font-luxury">{success}</div>}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
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
            <button
              type="submit"
              className="w-full bg-luxury-brown text-white py-3 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition text-lg mt-2"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block mb-1 font-luxury font-semibold text-luxury-brown">OTP</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                placeholder="Enter the OTP sent to your email"
              />
            </div>
            <div>
              <label className="block mb-1 font-luxury font-semibold text-luxury-brown">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                placeholder="Enter your new password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-luxury-brown text-white py-3 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition text-lg mt-2"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 