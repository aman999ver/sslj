import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('/api/client/admin/all');
        setClients(res.data.clients);
      } catch (err) {
        setError('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">All Clients</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Address</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Registered</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map(client => (
                <tr key={client._id}>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap font-medium text-gray-900">{client.firstName} {client.lastName}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{client.email}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{client.phone}</td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap max-w-[120px] sm:max-w-xs truncate">
                    {client.address ? (
                      <span>{client.address.street}, {client.address.city}, {client.address.state} {client.address.pincode}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                    {client.isActive ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Active</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Inactive</span>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-xs text-gray-500">{new Date(client.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientManagement; 