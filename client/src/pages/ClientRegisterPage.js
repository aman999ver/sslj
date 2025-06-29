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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.address) {
      setForm({ ...form, address: { ...form.address, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        localStorage.setItem('clientUser', JSON.stringify(data.user));
        localStorage.setItem('clientToken', data.token);
        navigate('/');
      } else {
        setError(data.errors ? data.errors.join(', ') : data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Registration</h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
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
            <input type="email" name="email" className="w-full border border-gray-300 rounded px-3 py-2" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input type="text" name="phone" className="w-full border border-gray-300 rounded px-3 py-2" value={form.phone} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" name="password" className="w-full border border-gray-300 rounded px-3 py-2" value={form.password} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Street</label>
            <input type="text" name="street" className="w-full border border-gray-300 rounded px-3 py-2" value={form.address.street} onChange={handleChange} required />
          </div>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block mb-1 font-medium">City</label>
              <input type="text" name="city" className="w-full border border-gray-300 rounded px-3 py-2" value={form.address.city} onChange={handleChange} required />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-medium">State</label>
              <input type="text" name="state" className="w-full border border-gray-300 rounded px-3 py-2" value={form.address.state} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Pincode</label>
            <input type="text" name="pincode" className="w-full border border-gray-300 rounded px-3 py-2" value={form.address.pincode} onChange={handleChange} required />
          </div>
          <button type="submit" className="w-full bg-gold-600 text-white py-2 rounded font-semibold hover:bg-gold-700 transition" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="text-gold-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ClientRegisterPage; 