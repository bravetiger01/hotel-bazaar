"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  // 🔥--- FIX: Works with Supabase (`id`) + fallback for Mongo (`_id`)
  const getId = (p) => p?.id || p?._id;

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const pid = getId(product);
      const existing = prev.find((item) => getId(item.product) === pid);

      // Update existing product
      if (existing) {
        return prev.map((item) => {
          if (getId(item.product) === pid) {
            const newQty = item.quantity + quantity;
            const maxStock = item.product.stock || product.stock || 0;
            return { ...item, quantity: Math.min(newQty, maxStock) };
          }
          return item;
        });
      }

      // Add new product (ensure stock limit)
      const finalQty = Math.min(quantity, product.stock || 1);
      return [...prev, { product, quantity: finalQty }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => getId(item.product) !== productId));
  };

  const updateQuantity = (productId, qty) => {
    setItems((prev) =>
      prev.map((item) => {
        if (getId(item.product) === productId) {
          const max = item.product.stock || 0;
          return { ...item, quantity: Math.min(Math.max(qty, 1), max) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const getItemCount = () =>
    items.reduce((acc, item) => acc + item.quantity, 0);

  const getTotalPrice = () =>
    items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
