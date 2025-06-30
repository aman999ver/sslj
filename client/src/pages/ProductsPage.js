import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories/with-counts')
        ]);
        
        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
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
    <div className="group bg-white rounded-2xl shadow-luxury hover:shadow-premium transition-all duration-500 transform hover:scale-105 overflow-hidden border border-gold-100 flex flex-col">
      <Link to={`/products/${product._id}`} className="block flex-1">
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img 
            src={product.images[0]} 
            alt={product.name + ' - Subha Laxmi Jewellery'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            style={{ aspectRatio: '4/3' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          {product.featured && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-luxury-gradient text-white px-2 sm:px-3 py-1 rounded-full text-xs font-premium font-semibold">
              Featured
            </div>
          )}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 text-gold-600 px-1 sm:px-2 py-1 rounded-full text-xs font-premium font-semibold">
            {product.metalType}
          </div>
        </div>
        <div className="p-2 sm:p-4 flex flex-col gap-1 sm:gap-2">
          <h2 className="text-base sm:text-lg font-premium font-semibold text-gold-800 mb-1 truncate">
            {product.name}
          </h2>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
            <span>{product.category}</span>
            <span>• {product.weight}g</span>
          </div>
          <div className="text-royal-700 font-bold text-sm sm:text-base">
            NPR {product.price.toLocaleString()}
          </div>
        </div>
      </Link>
      {/* Add to Cart Button */}
      <div className="px-4 pb-3">
        <button
          onClick={(e) => handleAddToCart(e, product._id)}
          disabled={cartLoading}
          className="w-full bg-gold-600 text-white py-2 rounded-lg font-semibold hover:bg-gold-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-2xl shadow-luxury hover:shadow-premium transition-all duration-300 overflow-hidden border border-gold-100 mb-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <img 
            src={product.images[0]} 
            alt={product.name + ' - Subha Laxmi Jewellery'}
            className="h-40 sm:h-48 md:h-full w-full object-cover" 
          />
          {product.featured && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-luxury-gradient text-white px-2 sm:px-3 py-1 rounded-full text-xs font-premium font-semibold">
              Featured
            </div>
          )}
        </div>
        <div className="md:w-2/3 p-3 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-premium font-semibold text-gold-800 mb-2 truncate">
              {product.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-2 sm:mb-4">
              <div className="text-xs sm:text-sm">
                <span className="font-premium text-gray-600">Category:</span>
                <div className="font-semibold text-royal-600 truncate">{product.category}</div>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-premium text-gray-600">Metal:</span>
                <div className="font-semibold text-gold-600 truncate">{product.metalType}</div>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-premium text-gray-600">Weight:</span>
                <div className="font-semibold">{product.weight}g</div>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-premium text-gray-600">Making Charge:</span>
                <div className="font-semibold">NPR {product.makingCharge}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
            <Link to={`/products/${product._id}`} className="w-full sm:w-auto bg-luxury-gradient text-white px-4 py-2 rounded-lg font-premium font-semibold text-center hover:shadow-premium transition-all duration-300">
              View Details
            </Link>
            <button
              onClick={(e) => handleAddToCart(e, product._id)}
              disabled={cartLoading}
              className="bg-gold-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gold-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cartLoading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-2 sm:px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories Sidebar */}
          <aside className="md:w-1/4 w-full mb-8 md:mb-0">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-premium font-semibold text-gold-800 mb-4">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${!selectedCategory ? 'bg-gold-600 text-white' : 'text-gray-700 hover:bg-gold-50'}`}
                    onClick={() => handleCategoryClick('')}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      className={`w-full flex items-center text-left px-3 py-2 rounded-lg font-medium transition-colors ${selectedCategory === cat.name ? 'bg-gold-600 text-white' : 'text-gray-700 hover:bg-gold-50'}`}
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                      {cat.image && (
                        <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-full object-cover mr-2 border border-gold-200" />
                      )}
                      {cat.name} <span className="ml-2 text-xs text-gray-500">({cat.count || cat.productCount || 0})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Section */}
          <section className="flex-1">
            {/* Filters and Controls */}
            <div className="bg-white rounded-2xl shadow-luxury p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Metal Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
                    <select
                      value={selectedMetal}
                      onChange={(e) => setSelectedMetal(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    >
                      <option value="">All Metals</option>
                      <option value="24K">24K Gold</option>
                      <option value="22K">22K Gold</option>
                      <option value="Silver">Silver</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    >
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="weight">Weight</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'grid' 
                        ? 'bg-gold-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition ${
                      viewMode === 'list' 
                        ? 'bg-gold-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'gap-4'}`}>
                {filteredProducts.map(product => 
                  viewMode === 'grid' 
                    ? <ProductCard key={product._id} product={product} />
                    : <ProductListItem key={product._id} product={product} />
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 