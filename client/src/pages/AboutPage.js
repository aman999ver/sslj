import React from 'react';
import { Helmet } from 'react-helmet';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Subha Laxmi Jewellery | Nepal's Trusted Jeweller</title>
        <meta name="description" content="Learn about Subha Laxmi Jewellery, Biratnagar's trusted gold and diamond jeweller. Discover our story, values, and commitment to quality." />
      </Helmet>
      <div className="bg-white px-2 sm:px-4 md:px-8 min-h-screen luxury-bg-pattern mt-10 md:mt-19 overflow-x-hidden">
        {/* Hero Banner - About */}
        <section className="relative border-b border-luxury-brown pb-8 mb-8 fade-in-section">
          <div className="relative w-full flex items-center justify-center min-h-[320px] sm:min-h-[420px] md:min-h-[540px] py-8 sm:py-16 md:py-20">
            <img
              src="/logo.png"
              alt="Subha Laxmi Jewellery Logo"
              className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0"
              style={{ pointerEvents: 'none', minHeight: '320px', maxHeight: '700px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-luxury-brown/60 z-10"></div>
            <div className="relative z-20 max-w-3xl mx-auto px-2 sm:px-4 text-center flex flex-col items-center justify-center h-full">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury font-bold text-luxury-brown drop-shadow-lg mb-4 sm:mb-6 leading-tight">About Subha Laxmi Jewellery</h1>
              <p className="text-base sm:text-xl md:text-2xl text-luxury-brown font-luxury mb-4 sm:mb-8 font-light">Nepal's Premier Luxury Jewellery Destination</p>
              <p className="text-sm sm:text-lg md:text-xl text-luxury-brown mb-6 sm:mb-10 max-w-2xl mx-auto font-luxury">Crafting timeless elegance and preserving precious moments since our establishment</p>
            </div>
            <div className="pointer-events-none absolute inset-0 z-40 shimmer-gold"></div>
          </div>
        </section>
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-12 opacity-60"></div>
        {/* Our Story Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 fade-in-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-luxury font-bold text-luxury-brown mb-6">Our Story</h2>
              <div className="space-y-4 text-luxury-brown/80 text-lg leading-relaxed font-luxury">
                <p>
                  Subha Laxmi Jewellery was founded with a vision to bring the finest quality jewellery to the people of Biratnagar and beyond. Our journey began with a simple yet powerful mission: to create pieces that not only adorn but also tell stories of love, tradition, and celebration.
                </p>
                <p>
                  Located in the heart of Biratnagar, Ramjanki Path, we have been serving our valued customers with dedication and commitment. Our store has become a trusted destination for those seeking authentic, high-quality jewellery that combines traditional craftsmanship with contemporary designs.
                </p>
                <p>
                  Over the years, we have built a reputation for excellence, integrity, and customer satisfaction. Every piece in our collection is carefully selected and crafted to meet the highest standards of quality and beauty.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-gold p-0 border-2 border-gold-200 luxury-bg-pattern flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
              <img src="/shop.jpg" alt="Subha Laxmi Jewellery Shop" className="absolute inset-0 w-full h-full object-cover rounded-2xl z-0" />
            </div>
          </div>
        </section>
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-12 opacity-60"></div>
        {/* Luxury Features Section */}
        <section className="py-20 bg-white fade-in-section mt-10 rounded-2xl shadow-gold max-w-6xl mx-auto">
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
        </section>
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-12 opacity-60"></div>
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gold-500 to-gold-700 rounded-2xl p-8 text-center text-white shadow-gold max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-luxury font-bold mb-4">Ready to Find Your Perfect Piece?</h2>
          <p className="text-xl mb-6 text-gold-100 font-luxury">
            Visit our store or browse our online collection to discover the jewellery of your dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-white text-gold-600 px-8 py-3 rounded-lg font-luxury font-semibold hover:bg-gold-50 transition-colors shadow-gold"
            >
              Browse Collection
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-luxury font-semibold hover:bg-white hover:text-gold-600 transition-colors shadow-gold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage; 