import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      alert('Failed to send your message. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Subha Laxmi Jewellery | Biratnagar, Nepal</title>
        <meta name="description" content="Get in touch with Subha Laxmi Jewellery in Biratnagar, Nepal. Call, visit, or send us a message for all your gold and diamond jewellery needs." />
      </Helmet>
      <div className="bg-white px-2 sm:px-4 md:px-8 min-h-screen luxury-bg-pattern mt-10 md:mt-19 overflow-x-hidden">
        {/* Hero Banner - Contact */}
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
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-luxury font-bold text-luxury-brown drop-shadow-lg mb-4 sm:mb-6 leading-tight">Contact Us</h1>
              <p className="text-base sm:text-xl md:text-2xl text-luxury-brown font-luxury mb-4 sm:mb-8 font-light">Get in touch with us for any inquiries, custom orders, or to visit our store</p>
            </div>
            <div className="pointer-events-none absolute inset-0 z-40 shimmer-gold"></div>
          </div>
        </section>
        {/* Divider */}
        <div className="w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 rounded-full mb-12 opacity-60"></div>
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-16 fade-in-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-luxury font-bold text-luxury-brown mb-8">Get In Touch</h2>
              {/* Store Location */}
              <div className="bg-white rounded-2xl shadow-gold p-6 mb-6 border-2 border-gold-100 luxury-bg-pattern">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-gold">
                    <span className="text-gold-600 text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-luxury font-bold text-luxury-brown mb-2">Visit Our Store</h3>
                    <p className="text-luxury-brown/80 font-luxury mb-2">Ramjanki Path, Biratnagar, Nepal</p>
                    <p className="text-sm text-luxury-brown/60 font-luxury">
                      Located in the heart of Biratnagar, easily accessible from all parts of the city
                    </p>
                  </div>
                </div>
              </div>
              {/* Phone Numbers */}
              <div className="bg-white rounded-2xl shadow-gold p-6 mb-6 border-2 border-gold-100 luxury-bg-pattern">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-gold">
                    <span className="text-gold-600 text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-luxury font-bold text-luxury-brown mb-2">Call Us</h3>
                    <div className="space-y-2">
                      <a 
                        href="tel:+9779842031752" 
                        className="block text-luxury-brown font-luxury hover:text-gold-600 transition-colors"
                      >
                        +977 9842031752
                      </a>
                      <a 
                        href="tel:+9779815325777" 
                        className="block text-luxury-brown font-luxury hover:text-gold-600 transition-colors"
                      >
                        +977 9815325777
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Business Hours */}
              <div className="bg-white rounded-2xl shadow-gold p-6 mb-6 border-2 border-gold-100 luxury-bg-pattern">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-gold">
                    <span className="text-gold-600 text-xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-luxury font-bold text-luxury-brown mb-2">Business Hours</h3>
                    <span className="block text-sm text-luxury-brown/80 font-luxury">Sunday - Friday, 10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
              {/* WhatsApp */}
              <div className="bg-white rounded-2xl shadow-gold p-6 mb-6 border-2 border-gold-100 luxury-bg-pattern">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-gold">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-luxury font-bold text-luxury-brown mb-2">WhatsApp</h3>
                    <p className="text-luxury-brown/80 font-luxury mb-2">Quick responses and easy communication</p>
                    <a 
                      href="https://wa.me/9779842031752" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-luxury font-semibold"
                    >
                      <span>Chat on WhatsApp</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-gold p-6 border-2 border-gold-100 luxury-bg-pattern">
                <h3 className="text-xl font-luxury font-bold text-luxury-brown mb-4">Follow Us</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href="https://www.facebook.com/share/1BJ3BYHT2K/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.367-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-luxury-brown font-luxury font-semibold">Facebook</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/shree_subha_laxmi?igsh=cGVoc20xM3I2ZWNy&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-6 h-6" />
                    </div>
                    <span className="text-luxury-brown font-luxury font-semibold">Instagram</span>
                  </a>
                  <a 
                    href="https://www.tiktok.com/@subha_laxmi_jewellery?_t=ZS-8xbzlzqC6Qm&_r=1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </div>
                    <span className="text-luxury-brown font-luxury font-semibold">TikTok</span>
                  </a>
                  <a 
                    href="https://youtube.com/@subhalaxmijewellery" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <span className="text-luxury-brown font-luxury font-semibold">YouTube</span>
                  </a>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-luxury font-bold text-luxury-brown mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-gold p-8 border-2 border-gold-100 luxury-bg-pattern">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-luxury font-semibold text-luxury-brown mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-luxury font-semibold text-luxury-brown mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-luxury font-semibold text-luxury-brown mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-luxury font-semibold text-luxury-brown mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
                      placeholder="Subject of your message"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-luxury font-semibold text-luxury-brown mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gold-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent font-luxury text-luxury-brown bg-white/80 placeholder-luxury-brown"
                      placeholder="Type your message here..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-luxury-brown text-white py-3 rounded-xl font-luxury font-semibold shadow hover:bg-luxury-brown/90 transition text-lg mt-4"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Google Map Section */}
        <div className="max-w-4xl mx-auto px-2 sm:px-4 mb-16 fade-in-section">
          <h2 className="text-2xl sm:text-3xl font-luxury font-bold text-luxury-brown mb-6 text-center">Find Us on the Map</h2>
          <div className="bg-white rounded-2xl shadow-gold border-2 border-gold-100 luxury-bg-pattern p-2 sm:p-4 shimmer-gold">
            <div className="w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d881.6101990839899!2d87.28079746417924!3d26.45578909783269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef74470bf51b29%3A0x1502855e2442f691!2sShree%20Subha%20Laxmi%20Jewellery!5e0!3m2!1sen!2snp!4v1752640401609!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shree Subha Laxmi Jewellery Location"
                className="w-full h-full rounded-2xl border-2 border-gold-200 shadow-gold"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage; 