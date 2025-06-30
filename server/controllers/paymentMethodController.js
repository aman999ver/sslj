const PaymentMethod = require('../models/PaymentMethod');

// Add a new payment method
exports.addPaymentMethod = async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder, type } = req.body;
    const qrCode = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Dynamic validation based on type
    if (type === 'Bank') {
      if (!bankName || !accountNumber || !accountHolder) {
        return res.status(400).json({ success: false, message: 'Bank Name, Account Number, and Account Holder are required for Bank payment method.' });
      }
    } else if (type === 'eSewa') {
      if (!accountNumber || !accountHolder) {
        return res.status(400).json({ success: false, message: 'eSewa ID and Merchant Name are required for eSewa payment method.' });
      }
    } else if (type === 'Khalti') {
      if (!accountNumber || !accountHolder) {
        return res.status(400).json({ success: false, message: 'Khalti ID and Account Holder are required for Khalti payment method.' });
      }
    } else if (type === 'Other') {
      if (!bankName || !accountNumber || !accountHolder) {
        return res.status(400).json({ success: false, message: 'Payment Name, Account/ID, and Account Holder are required for Other payment method.' });
      }
    }

    const paymentMethod = new PaymentMethod({ bankName, accountNumber, accountHolder, type, qrCode });
    await paymentMethod.save();
    res.json({ success: true, paymentMethod });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add payment method' });
  }
};

// Get all payment methods
exports.getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find().sort({ createdAt: -1 });
    res.json({ success: true, methods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment methods' });
  }
};

// Update a payment method
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { bankName, accountNumber, accountHolder, type } = req.body;
    const update = { bankName, accountNumber, accountHolder, type };
    if (req.file) update.qrCode = `/uploads/${req.file.filename}`;
    const method = await PaymentMethod.findByIdAndUpdate(id, update, { new: true });
    if (!method) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, method });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update payment method' });
  }
};

// Delete a payment method
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PaymentMethod.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete payment method' });
  }
}; 