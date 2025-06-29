import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MetalRatesManagement = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    '24K': '',
    '22K': '',
    'Silver': ''
  });

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await axios.get('/api/metal-rates/all');
      setRates(res.data.rates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rates:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (metalType, value) => {
    setFormData(prev => ({
      ...prev,
      [metalType]: value
    }));
  };

  const handleUpdateRates = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const ratesToUpdate = Object.entries(formData)
        .filter(([_, value]) => value !== '')
        .map(([metalType, ratePerTola]) => ({
          metalType,
          ratePerTola: parseFloat(ratePerTola)
        }));

      if (ratesToUpdate.length === 0) {
        alert('Please enter at least one rate to update.');
        return;
      }

      await axios.post('/api/metal-rates/update-multiple', { rates: ratesToUpdate });
      
      setShowUpdateForm(false);
      setFormData({ '24K': '', '22K': '', 'Silver': '' });
      fetchRates();
      alert('Metal rates updated successfully! All product prices have been recalculated.');
    } catch (error) {
      console.error('Error updating rates:', error);
      alert('Error updating rates. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const initializeRates = async () => {
    if (window.confirm('This will set default metal rates. Continue?')) {
      try {
        await axios.post('/api/metal-rates/initialize');
        fetchRates();
        alert('Default rates initialized successfully!');
      } catch (error) {
        console.error('Error initializing rates:', error);
        alert('Error initializing rates. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-premium">Loading metal rates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-elegant font-bold text-gold-800">Metal Rates Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowUpdateForm(true)}
            className="bg-luxury-gradient text-white px-6 py-2 rounded-lg font-premium font-semibold hover:shadow-premium transition-all duration-300"
          >
            Update Rates
          </button>
          {rates.length === 0 && (
            <button
              onClick={initializeRates}
              className="bg-royal-600 text-white px-6 py-2 rounded-lg font-premium font-semibold hover:bg-royal-700 transition-colors"
            >
              Initialize Default Rates
            </button>
          )}
        </div>
      </div>

      {/* Current Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['24K', '22K', 'Silver'].map(metalType => {
          const rate = rates.find(r => r.metalType === metalType);
          return (
            <div key={metalType} className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-600 mb-2">{metalType}</div>
                {rate ? (
                  <>
                    <div className="text-3xl font-premium font-bold text-royal-700 mb-2">
                      NPR {rate.ratePerTola.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 font-premium mb-4">
                      Updated: {new Date(rate.lastUpdated).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      by {rate.updatedBy?.username || 'Admin'}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 font-premium">No rate set</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <div className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
          <h3 className="text-xl font-elegant font-bold text-gold-800 mb-6">Update Metal Rates</h3>
          
          <form onSubmit={handleUpdateRates} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['24K', '22K', 'Silver'].map(metalType => {
                const currentRate = rates.find(r => r.metalType === metalType);
                return (
                  <div key={metalType}>
                    <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                      {metalType} Rate (NPR per Tola)
                    </label>
                    <input
                      type="number"
                      value={formData[metalType]}
                      onChange={(e) => handleInputChange(metalType, e.target.value)}
                      placeholder={currentRate ? `Current: ${currentRate.ratePerTola}` : 'Enter rate'}
                      min="0"
                      step="0.01"
                      className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                    {currentRate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current: NPR {currentRate.ratePerTola.toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-gold-50 rounded-lg p-4">
              <h4 className="font-premium font-semibold text-gold-800 mb-2">⚠️ Important Note</h4>
              <p className="text-sm text-gray-600 font-premium">
                Updating metal rates will automatically recalculate prices for all products using these metals. 
                This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={updating}
                className="bg-luxury-gradient text-white px-6 py-2 rounded-lg font-premium font-semibold hover:shadow-premium transition-all duration-300 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Rates'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUpdateForm(false);
                  setFormData({ '24K': '', '22K': '', 'Silver': '' });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-premium font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rate History */}
      <div className="bg-white rounded-xl shadow-luxury border border-gold-100 overflow-hidden">
        <div className="p-6 border-b border-gold-100">
          <h3 className="text-xl font-elegant font-bold text-gold-800">Rate History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gold-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Metal Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Rate (NPR)
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Updated By
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gold-100">
              {rates.map(rate => (
                <tr key={rate._id} className="hover:bg-gold-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-premium font-semibold text-gray-900">
                      {rate.metalType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-premium font-bold text-royal-700">
                      NPR {rate.ratePerTola.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rate.updatedBy?.username || 'Admin'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(rate.lastUpdated).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-premium ${
                      rate.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {rate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetalRatesManagement; 