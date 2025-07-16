import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const { addToCart, loading: cartLoading } = useCart();
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, relatedRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/products?category=${encodeURIComponent(product?.category || '')}&limit=4`)
        ]);
        
        setProduct(productRes.data.product);
        setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const fetchRelated = async () => {
        try {
          const res = await axios.get(`/api/products?category=${encodeURIComponent(product.category)}&limit=4`);
          setRelatedProducts(res.data.products.filter(p => p._id !== id));
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      };
      fetchRelated();
    }
  }, [product, id]);

  useEffect(() => {
    if (product) fetchReviews();
    // eslint-disable-next-line
  }, [product]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setReviews([]);
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    if (!localStorage.getItem('clientToken')) {
      window.alert('You need to login to submit a review. Redirecting to login page.');
      navigate('/login');
      setReviewLoading(false);
      return;
    }
    try {
      await axios.post(`/api/products/${product._id}/reviews`, reviewForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('clientToken')}` }
      });
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      setReviewError('Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!localStorage.getItem('clientToken')) {
      window.alert('You need to login to add items to your cart. Redirecting to login page.');
      navigate('/login');
      return;
    }
    const success = await addToCart(product._id, quantity);
    if (success) {
      alert('Product added to cart successfully!');
    }
  };

  const handleAddRelatedToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Product added to cart successfully!');
    }
  };

  const renderStars = (rating) => (
    <span className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-premium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-2xl font-elegant text-gold-800 mb-2">Product Not Found</h3>
          <p className="text-gray-600 font-premium mb-4">The product you're looking for doesn't exist.</p>
          <Link 
            to="/products" 
            className="bg-gold-600 text-white px-6 py-2 rounded-lg hover:bg-gold-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-1 sm:px-2 md:px-4 py-8 min-h-screen luxury-bg-pattern mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Product Image Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-luxury-brown overflow-hidden w-full">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-72 md:h-80 object-cover rounded-2xl"
                style={{ minHeight: 180, minWidth: 180 }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.featured && (
                  <span className="bg-tanishq-redLight text-tanishq-red px-3 py-1 rounded-full text-xs font-luxury font-semibold border border-tanishq-red shadow">Featured</span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-luxury font-semibold border ${product.metalType === '24K' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : product.metalType === '22K' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : product.metalType === 'Silver' ? 'bg-gray-100 text-gray-700 border-gray-300' : 'bg-gold-50 text-gold-700 border-gold-200'}`}>{product.metalType}</span>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx ? 'border-gold-500 shadow-lg' : 'border-gray-200 hover:border-gold-300'}`}
                >
                  <img src={img} alt={`${product.name} - ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-luxury font-bold text-luxury-brown mb-2">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-royal-100 text-royal-700 px-3 py-1 rounded-full text-xs font-luxury border border-royal-200">{product.category}</span>
                <span className="bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-xs font-luxury border border-gold-200">{product.metalType}</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-luxury border border-gray-200">SKU: {product.sku}</span>
              </div>
              <p className="text-luxury-brown font-luxury text-base leading-relaxed mb-2">{product.description}</p>
            </div>
            <div>
              <h3 className="text-xl font-luxury font-semibold text-gold-800 mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-base">
                <div className="flex justify-between"><span className="text-luxury-brown font-luxury">Weight:</span><span className="font-semibold text-luxury-brown">{product.weight}g</span></div>
                <div className="flex justify-between"><span className="text-luxury-brown font-luxury">Making Charge:</span><span className="font-semibold text-luxury-brown">NPR {product.makingCharge}</span></div>
                {product.lossPercentage > 0 && (<div className="flex justify-between"><span className="text-luxury-brown font-luxury">Loss Percentage:</span><span className="font-semibold text-ruby-600">{product.lossPercentage}%</span></div>)}
                <div className="flex justify-between"><span className="text-luxury-brown font-luxury">Metal Type:</span><span className="font-semibold text-gold-600">{product.metalType}</span></div>
              </div>
            </div>
            {/* Price Section just above Add to Cart */}
            <div className="bg-gradient-to-r from-gold-50 to-yellow-50 rounded-2xl p-6 border-2 border-gold-200 shadow-gold flex flex-col items-center">
              <div className="text-3xl font-luxury font-bold text-gold-600 mb-1">NPR {product.price.toLocaleString()}</div>
              <p className="text-sm text-luxury-brown font-luxury mb-2">Price includes making charges and current metal rates</p>
            </div>
            {/* Add to Cart Section at the bottom */}
            <div className="bg-white rounded-2xl shadow border border-gold-100 flex flex-col items-center p-4 mt-2">
              <div className="flex items-center space-x-3 mb-2">
                <label className="font-medium text-luxury-brown">Quantity:</label>
                <div className="flex items-center border border-gold-200 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 hover:bg-gold-50 transition-colors">-</button>
                  <span className="px-4 py-1 border-x border-gold-200 font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-gold-50 transition-colors">+</button>
                </div>
              </div>
              <button onClick={handleAddToCart} disabled={cartLoading} className="w-full bg-luxury-brown text-white py-3 rounded-xl font-luxury font-semibold text-lg shadow hover:bg-luxury-brown/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-2">{cartLoading ? 'Adding to Cart...' : 'Add to Cart'}</button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-luxury-brown mt-12 overflow-hidden">
          <div className="flex border-b border-gold-200 text-lg">
            {[
              { id: 'details', label: 'Product Details', icon: '📋' },
              { id: 'specifications', label: 'Specifications', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-luxury font-medium transition-colors ${activeTab === tab.id ? 'text-gold-600 border-b-2 border-gold-500 bg-gold-50' : 'text-luxury-brown hover:text-gold-500 hover:bg-gold-50'}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-10">
            {activeTab === 'details' && (
              <div className="prose max-w-none text-lg">
                <h3 className="text-2xl font-luxury font-semibold text-gold-800 mb-4">Product Details</h3>
                <p className="text-luxury-brown leading-relaxed text-lg">{product.description}</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gold-50 rounded-lg p-4">
                    <h4 className="font-luxury font-semibold text-gold-800 mb-2">Craftsmanship</h4>
                    <p className="text-luxury-brown text-sm">Handcrafted with traditional Nepali techniques and modern precision.</p>
                  </div>
                  <div className="bg-royal-50 rounded-lg p-4">
                    <h4 className="font-luxury font-semibold text-royal-800 mb-2">Quality Assurance</h4>
                    <p className="text-luxury-brown text-sm">Every piece is quality tested and certified for purity and craftsmanship.</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-luxury font-semibold text-gold-800 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gold-100"><span className="font-luxury text-luxury-brown">Product Name</span><span className="font-semibold">{product.name}</span></div>
                    <div className="flex justify-between py-2 border-b border-gold-100"><span className="font-luxury text-luxury-brown">Category</span><span className="font-semibold">{product.category}</span></div>
                    <div className="flex justify-between py-2 border-b border-gold-100"><span className="font-luxury text-luxury-brown">Metal Type</span><span className="font-semibold text-gold-600">{product.metalType}</span></div>
                    <div className="flex justify-between py-2 border-b border-gold-100"><span className="font-luxury text-luxury-brown">Weight</span><span className="font-semibold">{product.weight} grams</span></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gold-100"><span className="font-luxury text-luxury-brown">Making Charge</span><span className="font-semibold">NPR {product.makingCharge}</span></div>
                    {product.lossPercentage > 0 && (<div className="flex justify-between py-2 border-b border-gold-100"><span className="font-luxury text-luxury-brown">Loss Percentage</span><span className="font-semibold text-ruby-600">{product.lossPercentage}%</span></div>)}
                    <div className="flex justify-between py-2 border-b border-gold-100"><span className="font-luxury text-luxury-brown">SKU</span><span className="font-mono text-sm">{product.sku}</span></div>
                    <div className="flex justify-between py-2 border-b border-gold-100"><span className="font-luxury text-luxury-brown">Total Price</span><span className="font-semibold text-gold-600">NPR {product.price.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-luxury-brown p-8 mt-12">
          <h3 className="text-2xl font-luxury font-semibold text-gold-800 mb-6">Customer Reviews</h3>
          <form onSubmit={handleReviewSubmit} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <label className="font-luxury text-luxury-brown">Your Rating:</label>
              <select name="rating" value={reviewForm.rating} onChange={handleReviewChange} className="border border-gold-200 rounded-lg px-3 py-2">
                {[5,4,3,2,1].map(r => (<option key={r} value={r}>{r} Star{r > 1 && 's'}</option>))}
              </select>
              <input type="text" name="comment" value={reviewForm.comment} onChange={handleReviewChange} placeholder="Write your review..." className="flex-1 border border-gold-200 rounded-lg px-3 py-2" required />
            </div>
            <button type="submit" disabled={reviewLoading} className="w-full bg-luxury-brown text-white py-4 rounded-xl font-luxury font-semibold text-lg shadow hover:bg-luxury-brown/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">{reviewLoading ? 'Submitting...' : 'Submit Review'}</button>
          </form>
          {reviews.length === 0 ? (
            <div className="text-luxury-brown font-luxury">No reviews yet. Be the first to review this product!</div>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b border-gold-100 pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-luxury font-semibold text-gold-700">{rev.user?.firstName || 'Customer'}</span>
                    {renderStars(rev.rating)}
                    <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-luxury-brown font-luxury mb-1">{rev.comment}</div>
                  {rev.adminReply && (
                    <div className="ml-4 mt-2 p-3 bg-gold-50 rounded-lg border-l-4 border-gold-400">
                      <span className="font-semibold text-gold-700">Admin Reply:</span>
                      <span className="ml-2 text-luxury-brown">{rev.adminReply}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-luxury text-gold-800 mb-8 text-center">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct._id} className="group bg-white rounded-2xl shadow-lg border-2 border-luxury-brown hover:shadow-gold transition-all duration-500 transform hover:scale-105 overflow-hidden">
                <Link to={`/products/${relatedProduct._id}`} className="block">
                  <div className="relative overflow-hidden bg-white aspect-[1/1] md:aspect-[4/3]">
                    <img src={relatedProduct.images[0]} alt={relatedProduct.name} className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-t-2xl" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-2xl"></div>
                    {relatedProduct.featured && (
                      <div className="absolute top-4 left-4 bg-tanishq-redLight text-tanishq-red px-3 py-1 rounded-full text-xs font-luxury font-semibold border border-tanishq-red pointer-events-auto">Featured</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-1 sm:gap-2">
                    <h3 className="text-base sm:text-lg font-luxury font-semibold text-luxury-brown mb-1 truncate">{relatedProduct.name}</h3>
                    <div className="text-xs sm:text-sm text-luxury-brown mb-1">Weight: {relatedProduct.weight}g</div>
                    <div className="text-xs sm:text-sm text-luxury-brown mb-1">Category: {relatedProduct.category}</div>
                    <div className="mt-4 text-center">
                      <span className="font-luxury font-extrabold text-xl sm:text-2xl" style={{ color: '#B88900', textShadow: '0 1px 8px #f3e3b0, 0 0px 2px #fff' }}>
                        NPR {relatedProduct.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button onClick={() => handleAddRelatedToCart(relatedProduct._id)} disabled={cartLoading} className="w-full bg-luxury-brown text-white py-2 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition disabled:opacity-50 disabled:cursor-not-allowed">{cartLoading ? 'Adding...' : 'Add to Cart'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 