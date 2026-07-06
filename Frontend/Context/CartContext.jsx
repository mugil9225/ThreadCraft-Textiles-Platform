import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Syncing memory arrays safely to capture items from localStorage stream layers
  const [cartItems, setCartItems] = useState(() => {
    try {
      const existingStream = localStorage.getItem('cartMemoryStream');
      return existingStream ? JSON.parse(existingStream) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartMemoryStream', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existsIndex = prevItems.findIndex(item => item.id === product.id);
      if (existsIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existsIndex].quantity += 1;
        return newItems;
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartMemoryStream');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be executed strictly inside an allocated CartProvider wrapper framework.");
  }
  return context;
}