import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentVerification = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentGateway, setPaymentGateway] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrdersRequiringVerification();
  }, []);

  const fetchOrdersRequiringVerification = async () => {
    try {
      console.log('Fetching orders requiring verification...');
      const response = await axios.get('/api/admin/orders/verification/pending');
      console.log('Payment verification response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders);
        console.log('Orders requiring verification set:', response.data.orders.length);
      } else {
        console.error('API returned success: false for payment verification');
      }
    } catch (error) {
      console.error('Error fetching orders requiring verification:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId) => {
    if (!verificationNotes.trim()) {
      alert('Please add verification notes');
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(`/api/admin/orders/${orderId}/verify-payment`, {
        paymentScreenshot: selectedOrder.paymentDetails.paymentScreenshot,
        paymentNotes: verificationNotes,
        transactionId,
        paymentGateway
      });

      if (response.data.success) {
        alert('Payment verified successfully!');
        setSelectedOrder(null);
        setVerificationNotes('');
        setTransactionId('');
        setPaymentGateway('');
        fetchOrdersRequiringVerification();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectPayment = async (orderId) => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) return;

    setProcessing(true);
    try {
      const response = await axios.post(`/api/admin/orders/${orderId}/reject-payment`, {
        rejectionReason
      });

      if (response.data.success) {
        alert('Payment rejected successfully!');
        setSelectedOrder(null);
        fetchOrdersRequiringVerification();
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Failed to reject payment');
    } finally {
      setProcessing(false);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setVerificationNotes('');
    setTransactionId('');
    setPaymentGateway('');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Loading payment verifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payment Verification</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review and verify payment screenshots from customers
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-blue-700">
            {orders.length} orders pending verification
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✅</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All payments verified!</h3>
          <p className="text-gray-600">No orders are currently waiting for payment verification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders List */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Requiring Verification</h3>
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOrder?._id === order._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => openOrderDetails(order)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {(order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Unknown')}
                      </p>
                      <p className="text-sm text-gray-600">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details and Verification */}
          {selectedOrder && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Verification</h3>
              
              {/* Order Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Order #:</span> {selectedOrder.orderNumber}</p>
                  <p><span className="font-medium">Customer:</span> {(selectedOrder.user ? `${selectedOrder.user.firstName || ''} ${selectedOrder.user.lastName || ''}`.trim() : 'Unknown')}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.user?.email || '-'}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.user?.phone || '-'}</p>
                  <p><span className="font-medium">Amount:</span> ₹{selectedOrder.totalAmount}</p>
                  <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Payment Screenshot */}
              {selectedOrder.paymentDetails?.paymentScreenshot && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Screenshot</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedOrder.paymentDetails.paymentScreenshot}
                      alt="Payment Screenshot"
                      className="w-full h-64 object-contain bg-gray-50"
                    />
                  </div>
                </div>
              )}

              {/* Verification Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter transaction ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Gateway
                  </label>
                  <select
                    value={paymentGateway}
                    onChange={(e) => setPaymentGateway(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select payment gateway</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Paytm">Paytm</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Notes
                  </label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add verification notes..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleVerifyPayment(selectedOrder._id)}
                    disabled={processing || !verificationNotes.trim()}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {processing ? 'Verifying...' : 'Verify Payment'}
                  </button>
                  <button
                    onClick={() => handleRejectPayment(selectedOrder._id)}
                    disabled={processing}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {processing ? 'Rejecting...' : 'Reject Payment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentVerification; 