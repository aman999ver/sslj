import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminDashboard from './admin/AdminDashboard';
import LoginPage from './admin/LoginPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-luxury-cream">
        <Navbar />
        <div className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 