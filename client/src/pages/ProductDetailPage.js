import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomImg, setZoomImg] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-ruby">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-72 h-72 mb-4">
            <img
              src={zoomImg || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl border-4 border-gold cursor-zoom-in transition-transform duration-200 hover:scale-105"
              onClick={() => setZoomImg(zoomImg ? null : product.images[0])}
            />
            {zoomImg && (
              <button className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs text-ruby" onClick={() => setZoomImg(null)}>Close</button>
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`w-16 h-16 object-cover rounded border ${zoomImg === img ? 'border-royal' : 'border-gold'} cursor-pointer`}
                onClick={() => setZoomImg(img)}
              />
            ))}
          </div>
        </div>
        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-elegant text-gold mb-2">{product.name}</h1>
          <div className="text-lg text-royal mb-2">{product.category} | {product.metalType}</div>
          <div className="mb-2">Weight: <span className="font-bold">{product.weight}g</span></div>
          {product.lossPercentage > 0 && (
            <div className="mb-2 text-ruby">Loss: {product.lossPercentage}%</div>
          )}
          <div className="mb-2">Making Charge: <span className="font-bold">NPR {product.makingCharge}</span></div>
          <div className="mb-2">SKU: <span className="font-mono">{product.sku}</span></div>
          <div className="text-2xl font-bold text-gold mb-4">NPR {product.price.toLocaleString()}</div>
          {/* <button className="bg-gold text-white px-6 py-2 rounded-full font-bold shadow hover:bg-royal transition">Add to Cart</button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 