import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const categories = [
  { 
    name: 'Gold', 
    icon: '💛', 
    color: 'gold', 
    gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  { 
    name: 'Silver', 
    icon: '🤍', 
    color: 'gray-300', 
    gradient: 'bg-gradient-to-br from-gray-300 to-gray-500',
    image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  { 
    name: 'Rings', 
    icon: '💍', 
    color: 'ruby', 
    gradient: 'bg-gradient-to-br from-pink-400 to-pink-600',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  { 
    name: 'Necklaces', 
    icon: '📿', 
    color: 'royal', 
    gradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
];

// Simple chart component for metal rates
const MetalRateChart = ({ data, metalType, color }) => {
  const maxRate = Math.max(...data.map(d => d.rate));
  const minRate = Math.min(...data.map(d => d.rate));
  const range = maxRate - minRate;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{metalType} Rate Trend</h3>
      <div className="flex items-end justify-between h-32 space-x-1">
        {data.map((point, index) => {
          const height = range > 0 ? ((point.rate - minRate) / range) * 100 : 50;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full rounded-t ${color} transition-all duration-300 hover:opacity-80`}
                style={{ height: `${height}%` }}
                title={`${point.rate.toLocaleString()} NPR`}
              ></div>
              <span className="text-xs text-gray-500 mt-1">{point.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [rates, setRates] = useState([]);
  const [chartData, setChartData] = useState({
    Gold: [],
    Silver: []
  });

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
        <meta property="og:image" content="https://cdn-icons-png.flaticon.com/512/2583/2583346.png" />
        <meta property="og:url" content="https://subhalaxmijewellery.com.np/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subha Laxmi Jewellery | Nepal's Luxury Jewellery Store" />
        <meta name="twitter:description" content="Discover exquisite luxury jewelry from Nepal. Gold, silver, rings, necklaces at live market rates." />
        <meta name="twitter:image" content="https://cdn-icons-png.flaticon.com/512/2583/2583346.png" />
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              "name": "Subha Laxmi Jewellery",
              "url": "https://subhalaxmijewellery.com.np/",
              "logo": "https://cdn-icons-png.flaticon.com/512/2583/2583346.png",
              "image": "https://cdn-icons-png.flaticon.com/512/2583/2583346.png",
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
      <div className="bg-luxury-cream px-2 sm:px-4 md:px-8">
        {/* Hero Banner */}
        <section className="relative bg-premium-gradient py-16 sm:py-24 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-2 sm:px-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-elegant font-bold text-gold-800 drop-shadow-lg mb-4 sm:mb-6 animate-float">
              Subha Laxmi Jewellery
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl text-ruby-700 font-premium mb-4 sm:mb-8 font-light">
              Nepal's Premier Luxury Jewellery Destination
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-10 max-w-2xl mx-auto font-premium">
              Discover exquisite craftsmanship and timeless elegance in every piece
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-luxury-gradient text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-full shadow-premium hover:shadow-luxury transition-all duration-300 transform hover:scale-105"
            >
              Explore Collection
            </Link>
          </div>
        </section>

        {/* Categories */}
        <h2 className="text-2xl sm:text-4xl font-elegant text-center mb-2 sm:mb-4 text-gold-800">Our Collections</h2>
        <p className="text-center text-gray-600 mb-6 sm:mb-12 font-premium text-sm sm:text-base">Discover our handcrafted luxury pieces</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {categories.map(cat => (
            <Link 
              key={cat.name} 
              to={`/products?category=${cat.name}`} 
              className="group relative overflow-hidden rounded-2xl shadow-luxury hover:shadow-premium transition-all duration-500 transform hover:scale-105"
            >
              <div className="h-28 sm:h-48 relative overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                  <span className="text-lg sm:text-2xl mb-1 sm:mb-2 block">{cat.icon}</span>
                  <span className="text-base sm:text-xl font-premium font-semibold text-white drop-shadow-lg">{cat.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Live Metal Rates */}
        <section className="py-20 bg-gradient-to-br from-gold-50 to-luxury-champagne">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-elegant text-center mb-4 text-gold-800">Live Metal Rates</h2>
            <p className="text-center text-gray-600 mb-12 font-premium">Current market rates per Tola (NPR)</p>
            
            {rates.length === 0 ? (
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="w-32 h-32 bg-gold-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gold-200 rounded w-24 mx-auto"></div>
                </div>
                <span className="text-gray-500 font-premium">Loading rates...</span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Current Rates Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {rates.map(rate => (
                    <div key={rate.metalType} className="bg-white rounded-2xl p-6 shadow-luxury hover:shadow-premium transition-all duration-300 transform hover:scale-105 border border-gold-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold-600 mb-2">{rate.metalType}</div>
                        <div className="text-3xl font-premium font-bold text-royal-700 mb-2">
                          NPR {rate.ratePerTola.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 font-premium">
                          Updated: {new Date(rate.lastUpdated).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {chartData.Gold.length > 0 && (
                    <MetalRateChart 
                      data={chartData.Gold} 
                      metalType="Gold" 
                      color="bg-yellow-400"
                    />
                  )}
                  {chartData.Silver.length > 0 && (
                    <MetalRateChart 
                      data={chartData.Silver} 
                      metalType="Silver" 
                      color="bg-gray-400"
                    />
                  )}
                </div>
                
                {/* Rate Info */}
                <div className="bg-white rounded-2xl p-6 shadow-luxury mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Rate Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">Gold</div>
                      <div className="text-sm text-gray-600">Pure 24K Gold</div>
                      <div className="text-xs text-gray-500 mt-1">Per Tola (11.664g)</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600 mb-2">Silver</div>
                      <div className="text-sm text-gray-600">Pure 999 Silver</div>
                      <div className="text-xs text-gray-500 mt-1">Per Tola (11.664g)</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">Updates</div>
                      <div className="text-sm text-gray-600">Real-time rates</div>
                      <div className="text-xs text-gray-500 mt-1">Multiple times daily</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Luxury Features */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-elegant text-center mb-12 text-gold-800">Why Choose Subha Laxmi</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-premium font-semibold mb-2 text-gold-700">Premium Quality</h3>
                <p className="text-gray-600 font-premium">Handcrafted with the finest materials and attention to detail</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-xl font-premium font-semibold mb-2 text-gold-700">Heritage Craftsmanship</h3>
                <p className="text-gray-600 font-premium">Generations of traditional Nepali jewelry making expertise</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-premium font-semibold mb-2 text-gold-700">Live Pricing</h3>
                <p className="text-gray-600 font-premium">Transparent pricing based on current market rates</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage; 