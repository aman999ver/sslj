const Inquiry = require('../models/Inquiry');

// Create a new inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const inquiry = new Inquiry({ name, email, phone, subject, message });
    await inquiry.save();
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit inquiry' });
  }
};

// Get all inquiries (admin)
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
};

// Delete an inquiry (admin)
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete inquiry' });
  }
}; 