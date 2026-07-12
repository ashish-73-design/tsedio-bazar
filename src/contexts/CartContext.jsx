import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("tsedio_cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("tsedio_cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(productId, qty = 1) {
    setCart((c) => ({ ...c, [productId]: (c[productId] || 0) + qty }));
  }

  function setQty(productId, qty) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) {
        delete next[productId];
      } else {
        next[productId] = qty;
      }
      return next;
    });
  }

  function removeFromCart(productId) {
    setCart((c) => {
      const next = { ...c };
      delete next[productId];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, setQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
