import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ClientRegisterPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.address) {
      setForm({ ...form, address: { ...form.address, [name]: value } });
      if (name === 'pincode') {
        if (value && !/^\d{5}$/.test(value)) {
          setPincodeError('Pincode must be exactly 5 digits');
        } else {
          setPincodeError('');
        }
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.address.pincode && !/^\d{5}$/.test(form.address.pincode)) {
      setPincodeError('Pincode must be exactly 5 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.errors ? data.errors.join(', ') : data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-2 sm:px-4 py-12 fade-in-section">
      <div className="bg-white rounded-2xl shadow-gold border-4 border-gold-400 p-6 sm:p-12 w-full max-w-2xl shimmer-gold">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Subha Laxmi Logo" className="w-20 h-20 mb-2" />
          <h2 className="text-3xl font-luxury font-bold text-luxury-brown mb-2 text-center">Customer Registration</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-2 opacity-70"></div>
        </div>
        {success ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-gold-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-luxury font-bold text-luxury-brown mb-2 text-center">Registration Successful!</h3>
            <p className="text-lg text-luxury-brown/80 font-luxury text-center mb-4">Please check your email and click the verification link to activate your account.</p>
            <p className="text-sm text-luxury-brown/60 font-luxury text-center">Didn't receive the email? Check your spam folder or <a href="mailto:support@subhalaxmijewellery.com" className="text-gold-600 underline">contact support</a>.</p>
            <div className="mt-8 text-center font-luxury">
              <span className="text-luxury-brown/80">Already have an account? </span>
              <Link to="/login" className="text-gold-600 hover:underline font-semibold">Login</Link>
            </div>
          </div>
        ) : (
          <>
            {error && <div className="mb-4 text-red-600 text-center font-luxury">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-luxury font-semibold text-luxury-brown">First Name</label>
                  <input type="text" name="firstName" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.firstName} onChange={handleChange} required placeholder="First name" />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Last Name</label>
                  <input type="text" name="lastName" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.lastName} onChange={handleChange} required placeholder="Last name" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Email</label>
                  <input type="email" name="email" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.email} onChange={handleChange} required placeholder="Email address" />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Phone</label>
                  <input type="text" name="phone" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.phone} onChange={handleChange} required placeholder="Phone number" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Password</label>
                  <input type="password" name="password" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.password} onChange={handleChange} required placeholder="Password" />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Street</label>
                  <input type="text" name="street" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.address.street} onChange={handleChange} required placeholder="Street address" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-luxury font-semibold text-luxury-brown">City</label>
                  <input type="text" name="city" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.address.city} onChange={handleChange} required placeholder="City" />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block mb-1 font-luxury font-semibold text-luxury-brown">State</label>
                  <input type="text" name="state" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.address.state} onChange={handleChange} required placeholder="State" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Pincode <span className="text-xs text-luxury-brown/50">(optional, 5 digits)</span></label>
                <input
                  type="text"
                  name="pincode"
                  className={`w-full px-4 py-3 border ${pincodeError ? 'border-red-400' : 'border-gold-200'} rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown`}
                  value={form.address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  maxLength={5}
                  pattern="\d{5}"
                  inputMode="numeric"
                />
                {pincodeError && <div className="text-red-500 text-xs mt-1 font-luxury">{pincodeError}</div>}
              </div>
              <button type="submit" className="w-full bg-luxury-brown text-white py-3 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition text-lg mt-2" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <div className="mt-6 text-center font-luxury">
              <span className="text-luxury-brown/80">Already have an account? </span>
              <Link to="/login" className="text-gold-600 hover:underline font-semibold">Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientRegisterPage; 