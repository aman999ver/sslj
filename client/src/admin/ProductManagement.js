import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Gold',
    metalType: '24K',
    weight: '',
    lossPercentage: '0',
    makingCharge: '',
    featured: false,
    isActive: true
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const categories = ['Gold', 'Silver', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants', 'Chains'];
  const metalTypes = ['24K', '22K', 'Silver'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products/admin/all');
      setProducts(res.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Add images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formDataToSend);
      } else {
        await axios.post('/api/products', formDataToSend);
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      metalType: product.metalType,
      weight: product.weight.toString(),
      lossPercentage: product.lossPercentage.toString(),
      makingCharge: product.makingCharge.toString(),
      featured: product.featured,
      isActive: product.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Gold',
      metalType: '24K',
      weight: '',
      lossPercentage: '0',
      makingCharge: '',
      featured: false,
      isActive: true
    });
    setImages([]);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-premium">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-elegant font-bold text-gold-800">Product Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-luxury-gradient text-white px-6 py-2 rounded-lg font-premium font-semibold hover:shadow-premium transition-all duration-300"
        >
          Add New Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-luxury border border-gold-100">
          <h3 className="text-xl font-elegant font-bold text-gold-800 mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                  Metal Type *
                </label>
                <select
                  name="metalType"
                  value={formData.metalType}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                >
                  {metalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                  Weight (grams) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.1"
                  required
                  className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                  Loss Percentage (%)
                </label>
                <input
                  type="number"
                  name="lossPercentage"
                  value={formData.lossPercentage}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="50"
                  className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                  Making Charge (NPR) *
                </label>
                <input
                  type="number"
                  name="makingCharge"
                  value={formData.makingCharge}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-premium font-semibold text-gray-700 mb-2">
                Product Images *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                required={!editingProduct}
                className="w-full border border-gold-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Select multiple images (max 5, each up to 5MB)</p>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded border-gold-300 text-gold-600 focus:ring-gold-500"
                />
                <span className="ml-2 text-sm font-premium">Featured Product</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gold-300 text-gold-600 focus:ring-gold-500"
                />
                <span className="ml-2 text-sm font-premium">Active</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-luxury-gradient text-white px-6 py-2 rounded-lg font-premium font-semibold hover:shadow-premium transition-all duration-300 disabled:opacity-50"
              >
                {uploading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-premium font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-luxury border border-gold-100 overflow-hidden">
        <div className="p-6 border-b border-gold-100">
          <h3 className="text-xl font-elegant font-bold text-gold-800">All Products</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gold-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Metal
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-premium font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gold-100">
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gold-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                      />
                      <div>
                        <div className="text-sm font-premium font-semibold text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.metalType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.weight}g
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-premium ${
                        product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {product.featured && (
                        <span className="px-2 py-1 rounded-full text-xs font-premium bg-ruby-100 text-ruby-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-premium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-gold-600 hover:text-gold-800 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-ruby-600 hover:text-ruby-800 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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

export default ProductManagement; 