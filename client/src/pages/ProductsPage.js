import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, loading: cartLoading } = useCart();
  const [mobileCatOpen, setMobileCatOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories/with-counts')
        ]);
        
        setProducts(productsRes.data.products);
        setCategories((categoriesRes.data.categories || []).filter(cat => cat.isActive));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get URL parameters on mount
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem('clientToken')) {
      window.alert('You need to login to add items to your cart. Redirecting to login page.');
      window.location.href = '/login';
      return;
    }
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Product added to cart successfully!');
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (selectedMetal && product.metalType !== selectedMetal) return false;
      if (priceRange.min && product.price < parseFloat(priceRange.min)) return false;
      if (priceRange.max && product.price > parseFloat(priceRange.max)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'weight':
          return b.weight - a.weight;
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedMetal('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
    setSearchParams({});
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchParams({ category: categoryName });
  };

  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-lg border-2 border-luxury-brown hover:shadow-gold transition-all duration-300 flex flex-col overflow-hidden">
      <Link to={`/products/${product._id}`} className="block flex-1">
        <div className="relative overflow-hidden bg-white aspect-[1/1] md:aspect-[4/3]" style={{ minHeight: '160px' }}>
          <img 
            src={product.images[0]} 
            alt={product.name + ' - Subha Laxmi Jewellery'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-t-2xl"
            style={{ minHeight: '160px' }}
          />
          {/* Badges Row */}
          <div className="absolute top-2 left-0 w-full flex justify-between px-3 z-10 pointer-events-none">
            {/* Metal Type Badge */}
            {product.metalType && (
              <span
                className={
                  `px-3 py-1 rounded-full text-xs font-luxury font-semibold border pointer-events-auto ` +
                  (product.metalType === '24K'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    : product.metalType === '22K'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : product.metalType === 'Silver'
                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                    : 'bg-gold-50 text-gold-700 border-gold-200')
                }
                style={{ minWidth: 48, textAlign: 'center' }}
              >
                {product.metalType}
              </span>
            )}
            {/* Featured Badge */}
            {product.featured && (
              <span className="bg-tanishq-redLight text-tanishq-red px-3 py-1 rounded-full text-xs font-luxury font-semibold border border-tanishq-red pointer-events-auto">
                Featured
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-2xl"></div>
        </div>
        <div className="p-4 flex flex-col gap-1 sm:gap-2">
          <h2 className="text-base sm:text-lg font-luxury font-semibold text-luxury-brown mb-1 truncate">
            {product.name}
          </h2>
          <div className="text-xs sm:text-sm text-luxury-brown mb-1">
            Weight: {product.weight}g
          </div>
          <div className="text-xs sm:text-sm text-luxury-brown mb-1">
            Category: {product.category}
          </div>
          <div className="mt-4 text-center">
            <span
              className="font-luxury font-extrabold text-xl sm:text-2xl"
              style={{ color: '#B88900', textShadow: '0 1px 8px #f3e3b0, 0 0px 2px #fff' }}
            >
              NPR {product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => handleAddToCart(e, product._id)}
          disabled={cartLoading}
          className="w-full bg-luxury-brown text-white py-2 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Gold, Silver & Diamond Jewellery | Subha Laxmi Jewellery Nepal</title>
        <meta name="description" content="Explore our collection of gold, silver, and diamond jewellery. Buy online from Nepal's leading jewellery store in Biratnagar." />
      </Helmet>
      <div className="bg-white px-2 sm:px-4 md:px-8 py-8 min-h-screen luxury-bg-pattern">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Mobile Categories Button */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <h2 className="text-xl font-luxury font-bold" style={{ color: '#300708' }}>{selectedCategory ? selectedCategory : 'All Categories'}</h2>
            <button
              className="bg-luxury-brown text-gold-400 px-4 py-2 rounded-xl font-luxury font-semibold shadow border-2 border-luxury-brown hover:bg-tanishq-red hover:text-white transition"
              onClick={() => setMobileCatOpen(true)}
            >
              Categories
            </button>
          </div>
          {/* Mobile Categories Drawer */}
          {mobileCatOpen && (
            <div className="fixed inset-0 z-50 flex">
              {/* Overlay below navbar */}
              <div className="absolute left-0 right-0 top-16 bottom-0 bg-black/60" onClick={() => setMobileCatOpen(false)}></div>
              <div className="bg-white w-72 max-w-full h-full shadow-2xl p-6 flex flex-col border-r-2 border-luxury-brown animate-slideInLeft mt-16" style={{ maxHeight: 'calc(100vh - 64px)' }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-luxury font-bold text-luxury-brown">Categories</h2>
                  <button onClick={() => setMobileCatOpen(false)} className="text-tanishq-red text-2xl font-bold">&times;</button>
                </div>
                <ul className="space-y-2 mb-6">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-xl font-luxury font-medium border-2 transition-colors ${!selectedCategory ? 'bg-luxury-brown text-gold-400 border-luxury-brown' : 'bg-white text-luxury-brown border-luxury-brown hover:bg-tanishq-redLight hover:text-tanishq-red'}`}
                      onClick={() => { handleCategoryClick(''); setMobileCatOpen(false); }}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        className={`w-full flex items-center text-left px-3 py-2 rounded-xl font-luxury font-medium border-2 transition-colors ${selectedCategory === cat.name ? 'bg-luxury-brown text-gold-400 border-luxury-brown' : 'bg-white text-luxury-brown border-luxury-brown hover:bg-tanishq-redLight hover:text-tanishq-red'}`}
                        onClick={() => { handleCategoryClick(cat.name); setMobileCatOpen(false); }}
                      >
                        {cat.image && (
                          <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-full object-cover mr-2 border border-luxury-brown" />
                        )}
                        {cat.name} <span className="ml-2 text-xs text-luxury-brown">({cat.count || cat.productCount || 0})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Categories Sidebar REMOVED */}
            {/* Main Products Section */}
            <section className="flex-1">
              {/* Desktop Categories Bar (above grid) */}
              <div className="hidden md:flex flex-wrap gap-2 mb-8 justify-center items-center">
                <button
                  className={`px-5 py-2 rounded-full font-luxury font-semibold border-2 transition-colors text-base ${!selectedCategory ? 'bg-luxury-brown text-gold-400 border-luxury-brown' : 'bg-white text-luxury-brown border-luxury-brown hover:bg-tanishq-redLight hover:text-tanishq-red'}`}
                  onClick={() => handleCategoryClick('')}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    className={`px-5 py-2 rounded-full font-luxury font-semibold border-2 transition-colors text-base flex items-center ${selectedCategory === cat.name ? 'bg-luxury-brown text-gold-400 border-luxury-brown' : 'bg-white text-luxury-brown border-luxury-brown hover:bg-tanishq-redLight hover:text-tanishq-red'}`}
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    {cat.image && (
                      <img src={cat.image} alt={cat.name} className="w-7 h-7 rounded-full object-cover mr-2 border border-luxury-brown" />
                    )}
                    {cat.name}
                  </button>
                ))}
              </div>
              {/* Selected Category Heading (desktop) */}
              <div className="hidden md:block mb-8">
                <h2 className="text-2xl font-luxury font-bold" style={{ color: '#300708' }}>
                  {selectedCategory ? selectedCategory : 'All Categories'}
                </h2>
              </div>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                  {selectedCategory && ` in ${selectedCategory}`}
                </p>
              </div>
              {/* Products Display */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-pulse space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-luxury overflow-hidden">
                          <div className="h-48 bg-gold-200 animate-pulse"></div>
                          <div className="p-6 space-y-3">
                            <div className="h-4 bg-gold-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gold-100 rounded animate-pulse"></div>
                            <div className="h-3 bg-gold-100 rounded animate-pulse w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gold-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-elegant text-gold-800 mb-2">No Products Found</h3>
                  <p className="text-gray-600 font-premium mb-4">Try adjusting your filters or browse all products</p>
                  <button
                    onClick={clearFilters}
                    className="bg-gold-600 text-white px-6 py-2 rounded-lg hover:bg-gold-700 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => <ProductCard key={product._id} product={product} />)}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;