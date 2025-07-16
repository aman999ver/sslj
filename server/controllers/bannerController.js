const Banner = require('../models/Banner');
const path = require('path');

// List all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json({ banners });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
};

// Upload a new banner
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = '/uploads/' + req.file.filename;
    const banner = new Banner({ imageUrl, title: req.body.title || '' });
    await banner.save();
    res.status(201).json({ banner });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload banner' });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });
    // Optionally, delete the image file from disk
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
}; 