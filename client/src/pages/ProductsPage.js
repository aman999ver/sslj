import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-luxury-cream min-h-screen">
      {/* Header */}
      <div className="bg-premium-gradient py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-elegant font-bold text-gold-800 mb-4">Our Collection</h1>
          <p className="text-xl text-gray-600 font-premium max-w-2xl mx-auto">
            Discover our handcrafted luxury jewelry pieces, each telling a story of tradition and elegance
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
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
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gold-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-2xl font-elegant text-gold-800 mb-2">No Products Available</h3>
            <p className="text-gray-600 font-premium">Check back soon for our latest collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <Link 
                to={`/products/${product._id}`} 
                key={product._id} 
                className="group bg-white rounded-2xl shadow-luxury hover:shadow-premium transition-all duration-500 transform hover:scale-105 overflow-hidden border border-gold-100"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-luxury-gradient text-white px-3 py-1 rounded-full text-xs font-premium font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-premium font-semibold text-gold-800 mb-2 group-hover:text-gold-600 transition-colors">
                    {product.name}
                  </h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="font-premium">Category:</span>
                      <span className="font-semibold text-royal-600">{product.category}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="font-premium">Metal:</span>
                      <span className="font-semibold text-gold-600">{product.metalType}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="font-premium">Weight:</span>
                      <span className="font-semibold">{product.weight}g</span>
                    </div>
                    {product.lossPercentage > 0 && (
                      <div className="flex justify-between text-sm text-ruby-600">
                        <span className="font-premium">Loss:</span>
                        <span className="font-semibold">{product.lossPercentage}%</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="font-premium">Making Charge:</span>
                      <span className="font-semibold">NPR {product.makingCharge}</span>
                    </div>
                  </div>
                  <div className="border-t border-gold-100 pt-4">
                    <div className="text-2xl font-elegant font-bold text-gold-600 text-center">
                      NPR {product.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage; 