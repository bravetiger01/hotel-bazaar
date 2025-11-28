"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[CartProvider] Saving cart to localStorage:', items);
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);
  
  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product._id === product._id);
      
      if (existingItem) {
        return prev.map(item => {
          if (item.product._id === product._id) {
            const newQuantity = item.quantity + quantity;
            const maxStock = product.stock || item.product.stock || 0;
            // Enforce stock limit
            const finalQuantity = Math.min(newQuantity, maxStock);
            return { ...item, quantity: finalQuantity };
          }
          return item;
        });
      }
      
      // For new items, respect stock limit
      const maxStock = product.stock || 0;
      const finalQuantity = Math.min(quantity, maxStock);
      return [...prev, { product, quantity: finalQuantity }];
    });
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prev =>
      prev.map(item => {
        if (item.product._id === productId) {
          const maxStock = item.product.stock || 0;
          // Enforce stock limit
          const finalQuantity = Math.min(newQuantity, maxStock);
          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    console.log('[CartProvider] clearCart called. Cart will be emptied.');
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Export the provider as default for app-wide usage
export default CartProvider;