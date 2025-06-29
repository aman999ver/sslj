import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('clientToken');
      const response = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Confirmed': return 'text-blue-600 bg-blue-100';
      case 'Processing': return 'text-purple-600 bg-purple-100';
      case 'Shipped': return 'text-indigo-600 bg-indigo-100';
      case 'Delivered': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      case 'Verification Required': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOrderTimeline = (order) => {
    const timeline = [
      {
        status: 'Order Placed',
        date: new Date(order.createdAt),
        completed: true,
        icon: '📦'
      }
    ];

    if (order.paymentStatus === 'Paid' || order.paymentStatus === 'Verification Required') {
      timeline.push({
        status: 'Payment Received',
        date: order.paymentDetails?.paidAt ? new Date(order.paymentDetails.paidAt) : new Date(order.createdAt),
        completed: order.paymentStatus === 'Paid',
        icon: '💰'
      });
    }

    if (order.orderStatus === 'Confirmed') {
      timeline.push({
        status: 'Order Confirmed',
        date: new Date(order.updatedAt),
        completed: true,
        icon: '✅'
      });
    }

    if (order.orderStatus === 'Processing') {
      timeline.push({
        status: 'Processing',
        date: new Date(order.updatedAt),
        completed: true,
        icon: '⚙️'
      });
    }

    if (order.orderStatus === 'Shipped') {
      timeline.push({
        status: 'Shipped',
        date: new Date(order.updatedAt),
        completed: true,
        icon: '🚚'
      });
    }

    if (order.orderStatus === 'Delivered') {
      timeline.push({
        status: 'Delivered',
        date: order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.updatedAt),
        completed: true,
        icon: '🎉'
      });
    }

    return timeline;
  };

  const openTrackingModal = (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-gold-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gold-700 transition"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gold-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <button
                        onClick={() => openTrackingModal(order)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold hover:bg-blue-700 transition"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={item.product?.images?.[0] || '/placeholder-image.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.product?.name || 'Product'}</h4>
                          <p className="text-sm text-gray-600">
                            {item.product?.category || 'Category'} | {item.product?.metalType || 'Metal'}
                          </p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">NPR {item.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                          <p>Pincode: {order.shippingAddress.pincode}</p>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Payment Details</h4>
                        <div className="text-sm text-gray-600">
                          <p><strong>Method:</strong> {order.paymentMethod}</p>
                          <p><strong>Status:</strong> {order.paymentStatus}</p>
                          {order.paymentDetails?.transactionId && (
                            <p><strong>Transaction ID:</strong> {order.paymentDetails.transactionId}</p>
                          )}
                          {order.paymentDetails?.paymentNotes && (
                            <p><strong>Notes:</strong> {order.paymentDetails.paymentNotes}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Verification Status */}
                    {order.paymentMethod === 'ESEWA' && order.paymentStatus === 'Verification Required' && (
                      <div className="mt-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Payment Verification Pending:</strong> Your eSewa payment is being verified by admin.
                          </p>
                        </div>
                      </div>
                    )}

                    {order.paymentMethod === 'BANK_TRANSFER' && order.paymentStatus === 'Verification Required' && (
                      <div className="mt-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Payment Verification Pending:</strong> Your bank transfer is being verified by admin.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Order Notes</h4>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}

                    {/* Order Total */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <p>Subtotal: NPR {order.subtotal.toLocaleString()}</p>
                          <p>Shipping: Free</p>
                          <p>Tax: NPR {order.tax.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gold-600">
                            Total: NPR {order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Order Tracking - #{selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                </div>
                <div>
                  <p><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
                  <p><strong>Total Amount:</strong> NPR {selectedOrder.totalAmount.toLocaleString()}</p>
                  {selectedOrder.estimatedDelivery && (
                    <p><strong>Estimated Delivery:</strong> {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Order Timeline</h4>
              <div className="space-y-4">
                {getOrderTimeline(selectedOrder).map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        {step.date.toLocaleDateString()} at {step.date.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            {selectedOrder.paymentDetails && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Payment Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedOrder.paymentDetails.transactionId && (
                      <p><strong>Transaction ID:</strong> {selectedOrder.paymentDetails.transactionId}</p>
                    )}
                    {selectedOrder.paymentDetails.paymentGateway && (
                      <p><strong>Payment Gateway:</strong> {selectedOrder.paymentDetails.paymentGateway}</p>
                    )}
                    {selectedOrder.paymentDetails.paidAt && (
                      <p><strong>Paid On:</strong> {new Date(selectedOrder.paymentDetails.paidAt).toLocaleDateString()}</p>
                    )}
                    {selectedOrder.paymentDetails.verifiedBy && (
                      <p><strong>Verified By:</strong> Admin</p>
                    )}
                  </div>
                  {selectedOrder.paymentDetails.paymentNotes && (
                    <div className="mt-3">
                      <p><strong>Notes:</strong> {selectedOrder.paymentDetails.paymentNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Address */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Shipping Address</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                <p className="text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                <p className="text-sm">Pincode: {selectedOrder.shippingAddress.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 