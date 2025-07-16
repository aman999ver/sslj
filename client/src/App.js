import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './admin/AdminDashboard';
import LoginPage from './admin/LoginPage';
import Footer from './components/Footer';
import ClientLoginPage from './pages/ClientLoginPage';
import ClientRegisterPage from './pages/ClientRegisterPage';
import ClientProfilePage from './pages/ClientProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import RatesPage from './pages/RatesPage';

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/admin/login';

  // Health check useEffect
  React.useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('API Health:', data);
      })
      .catch(err => {
        console.error('API Health check failed:', err);
        alert('Warning: Backend API is not reachable!');
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-luxury-cream">
      {!isAdminRoute && !isAuthPage && <Navbar />}
      <div className={`flex-1 ${!isAdminRoute && !isAuthPage ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          <Route path="/login" element={<ClientLoginPage />} />
          <Route path="/register" element={<ClientRegisterPage />} />
          <Route path="/profile" element={<ClientProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/rates" element={<RatesPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </div>
      {!isAdminRoute && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App; 