import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cart, loading, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [notes, setNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  
  // Payment screenshot upload states
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentGateway, setPaymentGateway] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodsError, setMethodsError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load user profile
    fetch('/api/client/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          setShippingAddress(data.user.address);
          setBillingAddress(data.user.address);
        }
      })
      .catch(err => console.error('Failed to load user:', err));

    // Fetch payment methods
    fetch('/api/payment-methods')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPaymentMethods(data.methods);
        } else {
          setMethodsError('Failed to load payment methods');
        }
      })
      .catch(() => setMethodsError('Failed to load payment methods'))
      .finally(() => setMethodsLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [sameAsShipping, shippingAddress]);

  const handleAddressChange = (type, field, value) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentScreenshot(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'ESEWA' || paymentMethod === 'BANK_TRANSFER') {
      if (!paymentScreenshot) {
        window.alert('Please upload payment screenshot');
        return false;
      }
      if (!transactionId.trim()) {
        window.alert('Please enter transaction ID');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    if (!validatePaymentDetails()) {
      return;
    }

    setOrderLoading(true);
    try {
      const token = localStorage.getItem('clientToken');
      const orderData = {
        paymentMethod,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        notes,
        // Include payment details for screenshot payments
        ...(paymentMethod === 'ESEWA' || paymentMethod === 'BANK_TRANSFER' ? {
          paymentScreenshot,
          transactionId,
          paymentGateway,
          paymentNotes
        } : {})
      };

      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (data.success) {
        window.alert('Order placed successfully!');
        clearCart();
        navigate('/orders');
      } else {
        window.alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      window.alert('Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  // Helper to get method by type
  const getMethodByType = (type) => paymentMethods.find(m => m.type && m.type.toLowerCase() === type.toLowerCase());

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        {methodsLoading ? (
          <div className="text-center py-8">Loading payment methods...</div>
        ) : methodsError ? (
          <div className="text-center text-red-600 py-8">{methodsError}</div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange('shipping', 'street', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={shippingAddress.pincode}
                    onChange={(e) => handleAddressChange('shipping', 'pincode', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Billing Address</h2>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Same as shipping address</span>
                </label>
              </div>
              {!sameAsShipping && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={billingAddress.street}
                      onChange={(e) => handleAddressChange('billing', 'street', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={billingAddress.pincode}
                      onChange={(e) => handleAddressChange('billing', 'pincode', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-4">
                {/* Cash on Delivery */}
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive your order</div>
                  </div>
                </label>
                {/* eSewa Payment */}
                {getMethodByType('eSewa') && (
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ESEWA"
                      checked={paymentMethod === 'ESEWA'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">eSewa Payment</div>
                      <div className="text-sm text-gray-600">Pay securely through eSewa</div>
                    </div>
                  </label>
                )}
                {/* Bank Transfer */}
                {getMethodByType('Bank') && (
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">Bank Transfer</div>
                      <div className="text-sm text-gray-600">Transfer to our bank account</div>
                    </div>
                  </label>
                )}
              </div>
              {/* Payment Details */}
              {paymentMethod === 'BANK_TRANSFER' && getMethodByType('Bank') && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Bank Details for Transfer</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Bank:</strong> {getMethodByType('Bank').bankName}</p>
                    <p><strong>Account Name:</strong> {getMethodByType('Bank').accountHolder}</p>
                    <p><strong>Account Number:</strong> {getMethodByType('Bank').accountNumber}</p>
                  </div>
                  {getMethodByType('Bank').qrCode && (
                    <div className="mt-4 text-center">
                      <img
                        src={getMethodByType('Bank').qrCode}
                        alt="Bank QR Code"
                        className="w-32 h-32 object-contain border border-blue-300 rounded-lg mx-auto"
                      />
                      <p className="text-xs text-blue-600 mt-2">Scan this QR code to pay</p>
                    </div>
                  )}
                </div>
              )}
              {paymentMethod === 'ESEWA' && getMethodByType('eSewa') && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">eSewa Payment Details</h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>eSewa ID:</strong> {getMethodByType('eSewa').accountNumber}</p>
                    <p><strong>Merchant Name:</strong> {getMethodByType('eSewa').accountHolder}</p>
                  </div>
                  {getMethodByType('eSewa').qrCode && (
                    <div className="mt-4 text-center">
                      <img
                        src={getMethodByType('eSewa').qrCode}
                        alt="eSewa QR"
                        className="w-32 h-32 object-contain border border-green-300 rounded-lg mx-auto"
                      />
                      <p className="text-xs text-green-600 mt-2">Scan with eSewa app to pay</p>
                    </div>
                  )}
                </div>
              )}
              {/* Payment Screenshot Upload for eSewa and Bank Transfer */}
              {(paymentMethod === 'ESEWA' || paymentMethod === 'BANK_TRANSFER') && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-3">Payment Verification Required</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Screenshot *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {paymentScreenshot && (
                        <div className="mt-2">
                          <img
                            src={paymentScreenshot}
                            alt="Payment Screenshot"
                            className="w-32 h-32 object-contain border border-gray-300 rounded"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction ID *
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
                        <option value="eSewa">eSewa</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Notes
                      </label>
                      <textarea
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any additional notes about the payment..."
                      />
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Please complete your payment first, then upload the screenshot. 
                      Admin will verify your payment before processing the order.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Notes (Optional)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for your order..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.product?._id || item.product} className="flex items-center space-x-3">
                    <img
                      src={item.product?.images?.[0] || '/placeholder-image.jpg'}
                      alt={item.product?.name || 'Product'}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm">{item.product?.name || 'Product'}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">NPR {((item.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">NPR {cart.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">NPR 0</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gold-600">NPR {cart.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={orderLoading}
                className="w-full bg-gold-600 text-white py-3 rounded-lg font-semibold hover:bg-gold-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {orderLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage; 