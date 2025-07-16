import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import './HomePage.css';
import { useCart } from '../context/CartContext';
import { useRef } from 'react';

// Remove static categories, use real collections from API

// Simple chart component for metal rates
const MetalRateChart = ({ data, metalType, color }) => {
  const maxRate = Math.max(...data.map(d => d.rate));
  const minRate = Math.min(...data.map(d => d.rate));
  const range = maxRate - minRate;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-luxury-brown flex flex-col items-center w-full max-w-md mx-auto mb-8">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{metalType === 'Gold' ? '🥇' : '🥈'}</span>
        <h3 className="text-lg font-luxury font-semibold text-luxury-brown">{metalType} Rate Trend</h3>
      </div>
      <div className="flex items-end justify-between h-32 w-full space-x-1 mb-2">
        {data.map((point, index) => {
          const height = range > 0 ? ((point.rate - minRate) / range) * 100 : 50;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-3 rounded-t ${color} transition-all duration-300 hover:opacity-80`}
                style={{ height: `${height}%` }}
                title={`${point.rate.toLocaleString()} NPR`}
              ></div>
              <span className="text-xs text-luxury-brown mt-1 font-luxury">{point.time}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full flex justify-between text-xs text-luxury-brown font-luxury">
        <span>Min: {minRate.toLocaleString()}</span>
        <span>Max: {maxRate.toLocaleString()}</span>
      </div>
    </div>
  );
};

const heroImages = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1000&q=80',
];

// HERO CAROUSEL COMPONENT
function HeroCarousel() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => setBanners(data.banners || []))
      .catch(() => setBanners([]));
  }, []);

  // Fallback static images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1000&q=80',
  ];
  const images = banners.length > 0 ? banners : fallbackImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full flex items-center justify-center min-h-[320px] sm:min-h-[420px] md:min-h-[540px] py-8 sm:py-16 md:py-20">
      {images.map((img, idx) => (
        <img
          key={img._id || img.imageUrl || img}
          src={img.imageUrl || img}
          alt={img.title || 'Jewellery Hero'}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{ pointerEvents: idx === current ? 'auto' : 'none', minHeight: '320px', maxHeight: '700px' }}
        />
      ))}
      {/* Luxury brown/white gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-luxury-brown/60 z-20"></div>
      <div className="relative z-30 max-w-3xl mx-auto px-2 sm:px-4 text-center flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury font-bold text-luxury-brown drop-shadow-lg mb-4 sm:mb-6 leading-tight">Subha Laxmi Jewellery</h1>
        <p className="text-base sm:text-xl md:text-2xl text-luxury-brown font-luxury mb-4 sm:mb-8 font-light">Nepal's Premier Luxury Jewellery Destination</p>
        <p className="text-sm sm:text-lg md:text-xl text-luxury-brown mb-6 sm:mb-10 max-w-2xl mx-auto font-luxury">Discover exquisite craftsmanship and timeless elegance in every piece</p>
        <Link 
          to="/products" 
          className="inline-block bg-luxury-brown text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg hover:bg-luxury-brown/90 transition-all duration-300 text-base sm:text-lg md:text-xl"
        >
          Explore Collection
        </Link>
      </div>
      {/* Carousel Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full border-2 border-luxury-brown bg-white transition-all duration-300 ${current === idx ? 'bg-luxury-brown scale-125' : 'opacity-60'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Carousel for collections
function CollectionsCarousel({ collections }) {
  const [current, setCurrent] = useState(0);
  // Responsive cards per view
  const [perSlide, setPerSlide] = useState(4);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setPerSlide(1);
      else if (window.innerWidth < 768) setPerSlide(2);
      else setPerSlide(4);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Infinite loop logic
  const totalSlides = collections.length;
  useEffect(() => {
    if (totalSlides <= perSlide) return;
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % totalSlides);
        setAnimating(false);
      }, 400); // match transition duration
    }, 3500);
    return () => clearInterval(interval);
  }, [totalSlides, perSlide]);
  // Calculate visible items for infinite loop
  let visibleCollections = [];
  if (totalSlides > 0) {
    for (let i = 0; i < perSlide; i++) {
      visibleCollections.push(collections[(current + i) % totalSlides]);
    }
  }
  const cardWidth = perSlide === 1 ? 220 : perSlide === 2 ? 260 : 280;
  const containerWidth = perSlide * cardWidth + (perSlide - 1) * 16;
  return (
    <div
      className="relative fade-in-section w-full mx-auto box-border overflow-x-auto hide-scrollbar"
      style={{ maxWidth: containerWidth }}
    >
      <div
        className={`flex gap-x-4 min-w-0 transition-all duration-500`}
        style={{ width: containerWidth }}
      >
        <div
          className={`flex gap-x-4 w-full transition-all duration-500 transform ${animating ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}
        >
          {visibleCollections.map((col, i) => (
            <Link
              key={col._id || col.name || i}
              to={`/products?category=${encodeURIComponent(col.name)}`}
              className={`group flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] min-h-[340px] relative overflow-hidden rounded-2xl shadow-lg border-2 border-luxury-brown bg-white hover:scale-105 hover:shadow-gold transition-all duration-300 flex flex-col items-center p-6 z-10`}
            >
              {/* Gold accent dot */}
              <span className="block w-3 h-3 rounded-full bg-gold-400 mb-2"></span>
              <div className="h-36 sm:h-52 w-full flex items-center justify-center mb-4">
                <img
                  src={col.image || '/logo.png'}
                  alt={col.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-lg font-luxury font-semibold text-luxury-brown drop-shadow-lg mb-1">{col.name}</span>
              <span className="text-xs text-luxury-brown">{col.productCount || col.count || 0} products</span>
            </Link>
          ))}
        </div>
      </div>
      {/* Navigation dots */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 border-luxury-brown bg-white transition-all duration-300 ${current === idx ? 'bg-luxury-brown scale-125' : 'opacity-60'}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const HomePage = () => {
  const [rates, setRates] = useState([]);
  const [chartData, setChartData] = useState({
    Gold: [],
    Silver: []
  });
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState('');

  // --- Featured Products State/Logic ---
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { addToCart, loading: cartLoading } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const getPerView = () => (window.innerWidth >= 1024 ? 4 : 2);
  const [perView, setPerView] = useState(getPerView());
  useEffect(() => {
    const handleResize = () => {
      setPerView(getPerView());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const maxIndex = Math.max(0, products.length - perView);
  const handlePrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const handleNext = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));
  // Touch/drag support
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < maxIndex) {
          setCurrentIndex(i => Math.min(maxIndex, i + 1)); // swipe left
        } else if (diff < 0 && currentIndex > 0) {
          setCurrentIndex(i => Math.max(0, i - 1)); // swipe right
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };
  useEffect(() => {
    setProductsLoading(true);
    axios.get('/api/products?featured=true')
      .then(res => {
        setProducts(res.data.products || []);
        setProductsLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setProductsLoading(false);
      });
  }, []);
  const addToCartHandler = async (e, productId) => {
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
  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-2xl shadow-lg border-2 border-luxury-brown hover:shadow-gold transition-all duration-300 flex flex-col overflow-hidden min-w-[150px] sm:min-w-[160px] max-w-xs w-full mx-auto md:mx-2 p-2 sm:p-4 md:p-6 lg:p-6">
      <Link to={`/products/${product._id}`} className="block flex-1">
        <div className="relative overflow-hidden bg-white rounded-t-2xl w-full h-28 sm:h-36 md:h-44 lg:h-52">
          <img 
            src={product.images[0]} 
            alt={product.name + ' - Subha Laxmi Jewellery'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-t-2xl"
          />
          {/* Badges Row */}
          <div className="absolute top-2 left-0 w-full flex justify-between px-2 sm:px-3 z-10 pointer-events-none">
            {/* Metal Type Badge */}
            {product.metalType && (
              <span
                className={
                  `px-2 sm:px-3 py-1 rounded-full text-xs font-luxury font-semibold border pointer-events-auto ` +
                  (product.metalType === '24K'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    : product.metalType === '22K'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : product.metalType === 'Silver'
                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                    : 'bg-gold-50 text-gold-700 border-gold-200')
                }
                style={{ minWidth: 36, textAlign: 'center' }}
              >
                {product.metalType}
              </span>
            )}
            {/* Featured Badge */}
            {product.featured && (
              <span className="bg-tanishq-redLight text-tanishq-red px-2 sm:px-3 py-1 rounded-full text-xs font-luxury font-semibold border border-tanishq-red pointer-events-auto">
                Featured
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-2xl"></div>
        </div>
        <div className="p-2 sm:p-4 flex flex-col gap-1 sm:gap-2">
          <h2 className="text-xs sm:text-base md:text-lg font-luxury font-semibold text-luxury-brown mb-1 truncate">
            {product.name}
          </h2>
          <div className="text-xs sm:text-sm text-luxury-brown mb-1">
            Weight: {product.weight}g
          </div>
          <div className="text-xs sm:text-sm text-luxury-brown mb-1">
            Category: {product.category}
          </div>
          <div className="mt-2 sm:mt-4 text-center">
            <span
              className="font-luxury font-extrabold text-base sm:text-xl md:text-2xl"
              style={{ color: '#B88900', textShadow: '0 1px 8px #f3e3b0, 0 0px 2px #fff' }}
            >
              NPR {product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
      {/* Add to Cart Button */}
      <div className="px-2 sm:px-4 pb-2 sm:pb-4">
        <button
          onClick={(e) => addToCartHandler(e, product._id)}
          disabled={cartLoading}
          className="w-full bg-luxury-brown text-white py-2 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
        >
          {cartLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    axios.get('/api/metal-rates/current')
      .then(res => {
        setRates(res.data.rates);
        // Generate sample chart data (in real app, this would come from API)
        const generateChartData = (baseRate) => {
          return Array.from({ length: 7 }, (_, i) => ({
            rate: baseRate + (Math.random() - 0.5) * 1000,
            time: `${i + 1}d`
          }));
        };

        const goldRate = res.data.rates.find(r => r.metalType === 'Gold')?.ratePerTola || 150000;
        const silverRate = res.data.rates.find(r => r.metalType === 'Silver')?.ratePerTola || 2000;

        setChartData({
          Gold: generateChartData(goldRate),
          Silver: generateChartData(silverRate)
        });
      })
      .catch(() => setRates([]));

    axios.get('/api/categories/with-counts')
      .then(res => {
        setCollections((res.data.categories || []).filter(cat => cat.isActive));
        setCollectionsLoading(false);
      })
      .catch(() => {
        setCollections([]);
        setCollectionsError('Failed to load collections');
        setCollectionsLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Subha Laxmi Jewellery | Nepal's Premier Luxury Jewellery Destination</title>
        <meta name="description" content="Subha Laxmi Jewellery is Nepal's trusted luxury jewelry store. Shop gold, silver, diamond rings, necklaces, and more at live rates. Biratnagar, Nepal. Online and in-store." />
        <meta name="keywords" content="Nepal jewellery, gold jewelry, silver jewelry, diamond rings, luxury jewelry Nepal, buy jewelry Nepal, Biratnagar jewelry, Subha Laxmi, online jewelry store, wedding jewelry, engagement rings, handcrafted jewelry, e-commerce, live gold rate Nepal, trusted jeweller" />
        <link rel="canonical" href="https://subhalaxmijewellery.com.np/" />
        <meta property="og:title" content="Subha Laxmi Jewellery | Nepal's Premier Luxury Jewellery Destination" />
        <meta property="og:description" content="Discover exquisite gold, silver, and diamond jewelry in Nepal. Shop rings, necklaces, and more at live rates." />
        <meta property="og:image" content="https://subhalaxmijewellery.com.np/logo.png" />
        <meta property="og:url" content="https://subhalaxmijewellery.com.np/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subha Laxmi Jewellery | Nepal's Luxury Jewellery Store" />
        <meta name="twitter:description" content="Discover exquisite luxury jewelry from Nepal. Gold, silver, rings, necklaces at live market rates." />
        <meta name="twitter:image" content="https://subhalaxmijewellery.com.np/logo.png" />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              "name": "Subha Laxmi Jewellery",
              "url": "https://subhalaxmijewellery.com.np/",
              "logo": "https://subhalaxmijewellery.com.np/logo.png",
              "image": "https://subhalaxmijewellery.com.np/logo.png",
              "description": "Nepal's leading luxury jewelry store. Shop gold, silver, diamond rings, necklaces, and more at live rates. Trusted since 1990.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ramjanki Path",
                "addressLocality": "Biratnagar",
                "addressCountry": "NP"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+977 9842031752",
                "contactType": "customer service"
              },
              "openingHours": "Su-Fr 10:00-18:00",
              "sameAs": [
                "https://facebook.com/subhalaxmijewellery",
                "https://instagram.com/subhalaxmijewellery",
                "https://tiktok.com/@subhalaxmijewellery",
                "https://youtube.com/@subhalaxmijewellery"
              ]
            })
          }}
        />
      </Helmet>
      <div className="bg-white px-2 sm:px-4 md:px-8 min-h-screen luxury-bg-pattern mt-10 md:mt-19 overflow-x-hidden">
        {/* Hero Banner - Carousel */}
        <section className="relative border-b border-luxury-brown pb-8 mb-8 fade-in-section">
          <HeroCarousel />
          {/* Gold shimmer overlay */}
          <div className="pointer-events-none absolute inset-0 z-40 shimmer-gold"></div>
        </section>
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-12 opacity-60"></div>
        {/* Collections */}
        <h2 className="text-2xl sm:text-4xl font-luxury text-center mb-2 sm:mb-4 text-luxury-brown fade-in-section">Our Collections</h2>
        <p className="text-center text-luxury-brown mb-8 font-luxury text-sm sm:text-base fade-in-section">Discover our handcrafted luxury pieces</p>
        {collectionsLoading ? (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16 fade-in-section">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-100/40 via-white/0 to-white/0 z-0"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl shadow-lg border-2 border-luxury-brown bg-white p-6 animate-pulse h-64 flex flex-col items-center justify-center z-10">
                <div className="w-20 h-20 bg-luxury-brown/10 rounded-full mb-4"></div>
                <div className="h-4 w-24 bg-luxury-brown/20 rounded mb-2"></div>
                <div className="h-3 w-16 bg-luxury-brown/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : collectionsError ? (
          <div className="col-span-4 text-center text-luxury-brown font-luxury py-8">{collectionsError}</div>
        ) : collections.length === 0 ? (
          <div className="col-span-4 text-center text-luxury-brown font-luxury py-8">No collections found.</div>
        ) : (
          <CollectionsCarousel collections={collections} />
        )}
        {/* Divider */}
        <div className="w-full mt-3 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-10 opacity-60"></div>
        {/* Live Metal Rates */}
        <section className="py-20 fade-in-section">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-luxury text-center mb-4 text-luxury-brown">Live Metal Rates</h2>
           
            <p className="text-center text-luxury-brown mb-12 font-luxury">Current market rates per Tola (NPR)</p>
            {rates.length === 0 ? (
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="w-32 h-32 bg-luxury-brown/20 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-luxury-brown/20 rounded w-24 mx-auto"></div>
                </div>
                <span className="text-luxury-brown font-luxury">Loading rates...</span>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Centered Rate Cards with Trend */}
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                  {rates.map(rate => {
                    // Find trend: compare last two rates for this metal in chartData
                    let trend = null;
                    let prev = null;
                    if (chartData[rate.metalType] && chartData[rate.metalType].length >= 2) {
                      const arr = chartData[rate.metalType];
                      prev = arr[arr.length - 2]?.rate;
                      trend = rate.ratePerTola > prev ? 'up' : rate.ratePerTola < prev ? 'down' : 'same';
                    }
                    // Theme by metal type
                    let accent = 'from-gold-300 via-gold-500 to-gold-300';
                    let textColor = 'text-gold-700';
                    let borderColor = 'border-gold-300';
                    if (rate.metalType === 'Silver') {
                      accent = 'from-gray-300 via-gray-400 to-gray-300';
                      textColor = 'text-gray-500';
                      borderColor = 'border-gray-300';
                    } else if (rate.metalType === 'Platinum') {
                      accent = 'from-blue-200 via-blue-300 to-blue-200';
                      textColor = 'text-blue-700';
                      borderColor = 'border-blue-200';
                    }
                    return (
                      <div key={rate.metalType} className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${borderColor} hover:shadow-gold transition-all duration-300 flex flex-col items-center relative overflow-visible min-w-[260px] max-w-[320px] mx-auto`}>
                        {/* Colored accent bar */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${accent} rounded-t-2xl`}></div>
                        <div className="flex flex-col items-center justify-center mt-6 mb-2 w-full">
                          <div className="text-2xl font-bold text-luxury-brown font-luxury mb-1">{rate.metalType}</div>
                          <div className={`flex items-center justify-center text-3xl font-luxury font-bold ${textColor} mb-2`}>
                            NPR {rate.ratePerTola.toLocaleString()}
                            {trend === 'up' && <span className="ml-3 text-green-600 text-2xl font-bold">▲</span>}
                            {trend === 'down' && <span className="ml-3 text-red-600 text-2xl font-bold">▼</span>}
                            {trend === 'same' && <span className="ml-3 text-gray-400 text-2xl font-bold">—</span>}
                          </div>
                        </div>
                        <div className="text-xs text-luxury-brown font-luxury mb-2 w-full text-center">
                          Updated: {new Date(rate.lastUpdated).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Rate Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-luxury-brown mt-8 max-w-3xl mx-auto">
                  <h3 className="text-xl font-luxury text-luxury-brown mb-4 text-center">Rate Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-luxury-brown/10 rounded-lg">
                      <div className="text-2xl font-bold text-luxury-brown mb-2 font-luxury">Gold</div>
                      <div className="text-sm text-luxury-brown">Pure 24K Gold</div>
                      <div className="text-xs text-luxury-brown mt-1">Per Tola (11.664g)</div>
                    </div>
                    <div className="p-4 bg-luxury-brown/10 rounded-lg">
                      <div className="text-2xl font-bold text-luxury-brown mb-2 font-luxury">Silver</div>
                      <div className="text-sm text-luxury-brown">Sterling Silver</div>
                      <div className="text-xs text-luxury-brown mt-1">Per Tola (11.664g)</div>
                    </div>
                    <div className="p-4 bg-luxury-brown/10 rounded-lg">
                      <div className="text-2xl font-bold text-luxury-brown mb-2 font-luxury">Platinum</div>
                      <div className="text-sm text-luxury-brown">Premium Platinum</div>
                      <div className="text-xs text-luxury-brown mt-1">Per Tola (11.664g)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-12 opacity-60"></div>
        {/* Featured Products */}
        <h2 className="text-2xl md:text-3xl font-luxury font-bold text-center text-luxury-brown mb-8 mt-16">Featured Products</h2>
        {productsLoading ? (
          <div className="text-center text-luxury-brown font-luxury py-8">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-luxury-brown font-luxury py-8">No featured products found.</div>
        ) : (
          <div className="relative mb-8 fade-in-section">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="px-4 py-2 rounded-full bg-luxury-brown text-gold-400 font-bold shadow hover:bg-luxury-brown/90 disabled:opacity-40 disabled:cursor-not-allowed transition">&#8592;</button>
              <button onClick={handleNext} disabled={currentIndex >= maxIndex} className="px-4 py-2 rounded-full bg-luxury-brown text-gold-400 font-bold shadow hover:bg-luxury-brown/90 disabled:opacity-40 disabled:cursor-not-allowed transition">&#8594;</button>
            </div>
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {products.slice(currentIndex, currentIndex + perView).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
        {/* Luxury Features */}
        <section className="py-20 bg-white fade-in-section mt-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-luxury text-center mb-12 text-luxury-brown">Why Choose Subha Laxmi</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-luxury font-semibold mb-2 text-luxury-brown">Premium Quality</h3>
                <p className="text-luxury-brown font-luxury">Handcrafted with the finest materials and attention to detail</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-xl font-luxury font-semibold mb-2 text-luxury-brown">Heritage Craftsmanship</h3>
                <p className="text-luxury-brown font-luxury">Generations of traditional Nepali jewelry making expertise</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-luxury font-semibold mb-2 text-luxury-brown">Live Pricing</h3>
                <p className="text-luxury-brown font-luxury">Transparent pricing based on current market rates</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage; 