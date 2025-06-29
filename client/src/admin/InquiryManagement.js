import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axios.get('/api/inquiries');
        setInquiries(res.data.inquiries);
      } catch (err) {
        setError('Failed to fetch inquiries');
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/inquiries/${id}`);
      setInquiries(inquiries => inquiries.filter(i => i._id !== id));
    } catch (err) {
      alert('Failed to delete inquiry');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Inquiries</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.map(inquiry => (
                <tr key={inquiry._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{inquiry.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inquiry.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inquiry.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{inquiry.subject || '-'}</td>
                  <td className="px-6 py-4 whitespace-pre-line max-w-xs">{inquiry.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{new Date(inquiry.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
                      onClick={() => handleDelete(inquiry._id)}
                      disabled={deletingId === inquiry._id}
                    >
                      {deletingId === inquiry._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InquiryManagement;
