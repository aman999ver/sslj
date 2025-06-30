import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-cream to-gold-50 px-2 sm:px-4 md:px-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gold-600 to-gold-800 text-white py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              About Subha Laxmi Jewellery
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gold-100 max-w-3xl mx-auto">
              Crafting timeless elegance and preserving precious moments since our establishment
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Subha Laxmi Jewellery was founded with a vision to bring the finest quality jewellery 
                  to the people of Biratnagar and beyond. Our journey began with a simple yet powerful 
                  mission: to create pieces that not only adorn but also tell stories of love, tradition, 
                  and celebration.
                </p>
                <p>
                  Located in the heart of Biratnagar, Ramjanki Path, we have been serving our valued 
                  customers with dedication and commitment. Our store has become a trusted destination 
                  for those seeking authentic, high-quality jewellery that combines traditional craftsmanship 
                  with contemporary designs.
                </p>
                <p>
                  Over the years, we have built a reputation for excellence, integrity, and customer 
                  satisfaction. Every piece in our collection is carefully selected and crafted to meet 
                  the highest standards of quality and beauty.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Commitment</h3>
                <p className="text-gray-600">
                  We are committed to providing our customers with the finest quality jewellery, 
                  exceptional service, and a shopping experience that exceeds expectations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every piece in our collection meets the highest 
                standards of craftsmanship and purity.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Trust</h3>
              <p className="text-gray-600">
                Building lasting relationships with our customers through transparency, 
                honesty, and reliable service.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Combining traditional designs with modern aesthetics to create unique 
                pieces that stand the test of time.
              </p>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Visit Our Store</h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Location & Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-600">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Address</h4>
                      <p className="text-gray-600">Ramjanki Path, Biratnagar, Nepal</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-600">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Phone Numbers</h4>
                      <p className="text-gray-600">+977 9842031752</p>
                      <p className="text-gray-600">+977 9815325777</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-600">🕒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Business Hours</h4>
                      <p className="text-gray-600">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                      <p className="text-gray-600">Sunday: 11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center">
                      <span className="text-gold-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-600">Authentic and certified jewellery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center">
                      <span className="text-gold-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-600">Wide range of designs and collections</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center">
                      <span className="text-gold-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-600">Expert guidance and personalized service</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center">
                      <span className="text-gold-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-600">Competitive pricing and value for money</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center">
                      <span className="text-gold-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-600">After-sales support and maintenance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Collections */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Wedding Collection</h3>
              <p className="text-gray-600 text-sm">
                Exquisite bridal jewellery sets for your special day
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Traditional Sets</h3>
              <p className="text-gray-600 text-sm">
                Classic designs that celebrate our cultural heritage
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Modern Designs</h3>
              <p className="text-gray-600 text-sm">
                Contemporary pieces for the modern woman
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Diamond Collection</h3>
              <p className="text-gray-600 text-sm">
                Premium diamond jewellery for special occasions
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gold-600 to-gold-800 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Piece?</h2>
          <p className="text-xl mb-6 text-gold-100">
            Visit our store or browse our online collection to discover the jewellery of your dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-white text-gold-600 px-8 py-3 rounded-lg font-semibold hover:bg-gold-50 transition-colors"
            >
              Browse Collection
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gold-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 