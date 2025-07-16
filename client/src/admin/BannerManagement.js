import React, { useState, useEffect } from 'react';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fetchBanners = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      setError('Failed to load banners');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setFile(null);
      setTitle('');
      fetchBanners();
    } catch (err) {
      setUploadError('Failed to upload banner');
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      fetchBanners();
    } catch {
      alert('Failed to delete banner');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-gold border-4 border-gold-100 mt-10">
      <h2 className="text-2xl font-luxury font-bold text-luxury-brown mb-6">Banner Management</h2>
      <form onSubmit={handleUpload} className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full md:w-auto border border-gold-200 rounded-lg px-3 py-2 text-luxury-brown bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
          required
        />
        <input
          type="text"
          placeholder="Banner Title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="block w-full md:w-64 border border-gold-200 rounded-lg px-3 py-2 text-luxury-brown bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
        <button
          type="submit"
          disabled={uploading || !file}
          className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-2 rounded-lg shadow-gold transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Banner'}
        </button>
      </form>
      {uploadError && <div className="text-red-600 mb-4">{uploadError}</div>}
      <hr className="my-6 border-gold-200" />
      <h3 className="text-lg font-luxury font-semibold text-luxury-brown mb-4">Current Banners</h3>
      {loading ? (
        <div className="text-luxury-brown">Loading banners...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : banners.length === 0 ? (
        <div className="text-luxury-brown">No banners uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {banners.map(banner => (
            <div key={banner._id} className="bg-white border-2 border-gold-100 rounded-xl shadow-lg flex flex-col items-center p-4 relative">
              <img
                src={banner.imageUrl}
                alt={banner.title || 'Banner'}
                className="w-full h-40 object-cover rounded-lg mb-2 border border-gold-200"
                style={{ maxHeight: 180 }}
              />
              <div className="w-full flex flex-col items-center">
                <span className="text-luxury-brown font-luxury font-semibold text-base mb-1 truncate w-full text-center">{banner.title}</span>
                <span className="text-xs text-gold-400">{new Date(banner.createdAt).toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleDelete(banner._id)}
                className="absolute top-2 right-2 bg-tanishq-red text-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-tanishq-redLight transition"
                title="Delete banner"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerManagement; 