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

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!form) return <div className="flex justify-center items-center min-h-screen text-red-600">{error || 'Profile not found'}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block mb-1 font-medium">First Name</label>
              <input type="text" name="firstName" className="w-full border border-gray-300 rounded px-3 py-2" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-medium">Last Name</label>
              <input type="text" name="lastName" className="w-full border border-gray-300 rounded px-3 py-2" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" name="email" className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" value={form.email} disabled />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input type="text" name="phone" className="w-full border border-gray-300 rounded px-3 py-2" value={form.phone} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Street</label>
            <input type="text" name="street" className="w-full border border-gray-300 rounded px-3 py-2" value={form.address?.street || ''} onChange={handleChange} required />
          </div>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block mb-1 font-medium">City</label>
              <input type="text" name="city" className="w-full border border-gray-300 rounded px-3 py-2" value={form.address?.city || ''} onChange={handleChange} required />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-medium">State</label>
              <input type="text" name="state" className="w-full border border-gray-300 rounded px-3 py-2" value={form.address?.state || ''} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Pincode</label>
            <input type="text" name="pincode" className="w-full border border-gray-300 rounded px-3 py-2" value={form.address?.pincode || ''} onChange={handleChange} required />
          </div>
          <button type="submit" className="w-full bg-gold-600 text-white py-2 rounded font-semibold hover:bg-gold-700 transition">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientProfilePage; 