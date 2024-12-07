// src/contexts/CartContext.js

import React, { createContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import authService from "../services/authService";

// Create the Cart Context
export const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getCurrentUser();

  // Function to load cart items
  const loadCart = async () => {
    if (currentUser) {
      try {
        const response = await cartService.getCart();
        setCartItems(response.data);
        const totalCount = response.data.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setCartItemCount(totalCount);
      } catch (error) {
        console.error("Failed to load cart items:", error);
        setCartItems([]);
        setCartItemCount(0);
      }
    } else {
      setCartItems([]);
      setCartItemCount(0);
    }
    setLoading(false);
  };

  // Load cart on mount and when currentUser changes
  useEffect(() => {
    loadCart();
  }, [currentUser]);

  // Function to add to cart and update state
  const addToCart = async (productId, quantity) => {
    try {
      await cartService.addToCart(productId, quantity);
      await loadCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Function to remove from cart and update state
  const removeFromCart = async (productId, quantity) => {
    try {
      await cartService.removeFromCart(productId, quantity);
      await loadCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  // Function to clear cart and update state
  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await loadCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        addToCart,
        removeFromCart,
        clearCart,
        loading,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
