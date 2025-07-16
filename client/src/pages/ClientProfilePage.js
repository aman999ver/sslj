import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientProfilePage = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('/api/client/profile', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setForm(data.user);
        } else {
          setError('Failed to load profile');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (form.address && name in form.address) {
      setForm({ ...form, address: { ...form.address, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('clientToken');
    try {
      const res = await fetch('/api/client/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          address: form.address
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Profile updated successfully');
        localStorage.setItem('clientUser', JSON.stringify(data.user));
      } else {
        setError(data.errors ? data.errors.join(', ') : data.message || 'Update failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-white luxury-bg-pattern font-luxury text-luxury-brown">Loading...</div>;
  if (!form) return <div className="flex justify-center items-center min-h-screen bg-white luxury-bg-pattern font-luxury text-red-600">{error || 'Profile not found'}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-2 sm:px-4 py-4 fade-in-section">
      <div className="bg-white rounded-2xl shadow-gold border-4 border-gold-400 p-4 sm:p-8 w-full max-w-2xl shimmer-gold">
        <div className="flex flex-col items-center mb-3">
          <img src="/logo.png" alt="Subha Laxmi Logo" className="w-16 h-16 mb-1" />
          <h2 className="text-2xl font-luxury font-bold text-luxury-brown mb-1 text-center">My Profile</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-1 opacity-70"></div>
        </div>
        {error && <div className="mb-4 text-red-600 text-center font-luxury">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center font-luxury">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
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
          <div>
            <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Phone</label>
            <input type="text" name="phone" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.phone} onChange={handleChange} required placeholder="Phone number" />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Street</label>
              <input type="text" name="street" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.address?.street || ''} onChange={handleChange} required placeholder="Street address" />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-luxury font-semibold text-luxury-brown">City</label>
              <input type="text" name="city" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.address?.city || ''} onChange={handleChange} required placeholder="City" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-luxury font-semibold text-luxury-brown">State</label>
              <input type="text" name="state" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.address?.state || ''} onChange={handleChange} required placeholder="State" />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block mb-1 font-luxury font-semibold text-luxury-brown">Pincode</label>
              <input type="text" name="pincode" className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown" value={form.address?.pincode || ''} onChange={handleChange} required placeholder="Pincode" />
            </div>
          </div>
          <button type="submit" className="w-full bg-luxury-brown text-white py-3 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition text-lg mt-2">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientProfilePage; 