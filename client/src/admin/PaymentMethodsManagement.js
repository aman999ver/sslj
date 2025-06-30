import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentMethodsManagement = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    type: 'Bank',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    qrCode: null,
  });

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/payment-methods');
      setMethods(res.data.methods);
    } catch (err) {
      setError('Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', form.type);
    formData.append('bankName', form.bankName);
    formData.append('accountNumber', form.accountNumber);
    formData.append('accountHolder', form.accountHolder);
    if (form.qrCode) formData.append('image', form.qrCode);
    try {
      if (editId) {
        await axios.put(`/api/payment-methods/${editId}`, formData);
      } else {
        await axios.post('/api/payment-methods', formData);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ type: 'Bank', bankName: '', accountNumber: '', accountHolder: '', qrCode: null });
      fetchMethods();
    } catch (err) {
      setError('Failed to save payment method');
    }
  };

  const handleEdit = method => {
    setEditId(method._id);
    setForm({
      type: method.type || 'Bank',
      bankName: method.bankName,
      accountNumber: method.accountNumber,
      accountHolder: method.accountHolder,
      qrCode: null,
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this payment method?')) return;
    try {
      await axios.delete(`/api/payment-methods/${id}`);
      fetchMethods();
    } catch (err) {
      setError('Failed to delete payment method');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>
      <button
        className="bg-gold-700 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setShowForm(!showForm);
          setEditId(null);
          setForm({ type: 'Bank', bankName: '', accountNumber: '', accountHolder: '', qrCode: null });
        }}
      >
        {showForm ? 'Cancel' : 'Add Payment Method'}
      </button>
      {showForm && (
        <form className="bg-white p-4 rounded shadow mb-6 max-w-lg" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-2">
            <label className="block font-semibold">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="Bank">Bank</option>
              <option value="eSewa">eSewa</option>
              <option value="Khalti">Khalti</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {form.type === 'Bank' && (
            <>
              <div className="mb-2">
                <label className="block font-semibold">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
                <span className="text-xs text-gray-500">e.g. Nepal Bank Limited</span>
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Account Holder</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={form.accountHolder}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
            </>
          )}
          {form.type === 'eSewa' && (
            <>
              <div className="mb-2">
                <label className="block font-semibold">eSewa ID (Phone Number)</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
                <span className="text-xs text-gray-500">e.g. 98XXXXXXXX</span>
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Merchant Name</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={form.accountHolder}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
            </>
          )}
          {form.type === 'Khalti' && (
            <>
              <div className="mb-2">
                <label className="block font-semibold">Khalti ID</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Account Holder</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={form.accountHolder}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
            </>
          )}
          {form.type === 'Other' && (
            <>
              <div className="mb-2">
                <label className="block font-semibold">Payment Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Account/ID</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Account Holder</label>
                <input
                  type="text"
                  name="accountHolder"
                  value={form.accountHolder}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
            </>
          )}
          <div className="mb-2">
            <label className="block font-semibold">QR Code (Image)</label>
            <input
              type="file"
              name="qrCode"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full"
            />
            {editId && methods.find(m => m._id === editId)?.qrCode && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Current QR:</span>
                <img
                  src={methods.find(m => m._id === editId)?.qrCode}
                  alt="Current QR"
                  className="w-24 h-24 object-contain border rounded mt-1"
                />
              </div>
            )}
          </div>
          <button type="submit" className="bg-gold-700 text-white px-4 py-2 rounded mt-2">
            {editId ? 'Update' : 'Add'}
          </button>
        </form>
      )}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map(method => (
            <div key={method._id} className="bg-white rounded shadow p-4 flex flex-col gap-2">
              <div className="font-bold text-lg">{method.bankName}</div>
              <div className="text-xs text-gray-500">Type: {method.type || 'Bank'}</div>
              <div>Account Number: <span className="font-mono">{method.accountNumber}</span></div>
              <div>Account Holder: {method.accountHolder}</div>
              {method.qrCode && (
                <img src={method.qrCode} alt="QR Code" className="w-32 h-32 object-contain border rounded" />
              )}
              <div className="flex gap-2 mt-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => handleEdit(method)}>
                  Edit
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(method._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsManagement; 