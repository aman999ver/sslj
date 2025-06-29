import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  // Load cart from API on mount
  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (token) {
      loadCart();
    }
  }, []);

  const loadCart = async () => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Ensure cart has proper structure
        const safeCart = {
          items: data.cart?.items || [],
          totalAmount: data.cart?.totalAmount || 0,
          itemCount: data.cart?.itemCount || 0
        };
        setCart(safeCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
    setLoading(false);
  };

  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      alert('Please login to add items to cart');
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await response.json();
      if (data.success) {
        // Ensure cart has proper structure
        const safeCart = {
          items: data.cart?.items || [],
          totalAmount: data.cart?.totalAmount || 0,
          itemCount: data.cart?.itemCount || 0
        };
        setCart(safeCart);
        return true;
      } else {
        alert(data.message || 'Failed to add to cart');
        return false;
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await response.json();
      if (data.success) {
        // Ensure cart has proper structure
        const safeCart = {
          items: data.cart?.items || [],
          totalAmount: data.cart?.totalAmount || 0,
          itemCount: data.cart?.itemCount || 0
        };
        setCart(safeCart);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
    setLoading(false);
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Ensure cart has proper structure
        const safeCart = {
          items: data.cart?.items || [],
          totalAmount: data.cart?.totalAmount || 0,
          itemCount: data.cart?.itemCount || 0
        };
        setCart(safeCart);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
    setLoading(false);
  };

  const clearCart = async () => {
    const token = localStorage.getItem('clientToken');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Ensure cart has proper structure
        const safeCart = {
          items: data.cart?.items || [],
          totalAmount: data.cart?.totalAmount || 0,
          itemCount: data.cart?.itemCount || 0
        };
        setCart(safeCart);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
    setLoading(false);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 