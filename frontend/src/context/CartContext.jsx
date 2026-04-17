// context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

const API = "http://localhost:5000/api/cart";

function CartProvider({ children, userId }) {
  const [cart, setCart] = useState(() => {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  });
  const [loading, setLoading] = useState(false);

  // If user is logged in, fetch from DB and sync
  useEffect(() => {
    if (userId) {
      fetchCartFromDB();
    }
  }, [userId]);

  // If no user, persist to localStorage
  useEffect(() => {
    if (!userId) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, userId]);

  async function fetchCartFromDB() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/${userId}`);
      const data = await res.json();
      // Normalize DB response to match local cart shape
      const normalized = data.map(item => ({
        id: item.product_id,
        name: item.name,
        image: item.image,
        price: item.price_at_add,
        quantity: item.quantity,
      }));
      setCart(normalized);
      localStorage.setItem("cart", JSON.stringify(normalized));
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(product) {
    // Optimistic UI update first
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Then sync to DB if logged in
    if (userId) {
      try {
        await fetch(`${API}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId: product.id }),
        });
      } catch (err) {
        console.error("Failed to sync add to DB:", err);
      }
    }
  }

  async function updateQuantity(productId, quantity) {
    if (quantity < 1) return removeItem(productId);

    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    if (userId) {
      try {
        await fetch(`${API}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId, quantity }),
        });
      } catch (err) {
        console.error("Failed to sync update to DB:", err);
      }
    }
  }

  async function removeItem(productId) {
    setCart(prev => prev.filter(item => item.id !== productId));

    if (userId) {
      try {
        await fetch(`${API}/remove`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId }),
        });
      } catch (err) {
        console.error("Failed to sync remove to DB:", err);
      }
    }
  }

  async function clearCart() {
    setCart([]);
    localStorage.removeItem("cart");

    if (userId) {
      try {
        await fetch(`${API}/clear/${userId}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to sync clear to DB:", err);
      }
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, total, itemCount, addToCart, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for easy consumption
export function useCart() {
  return useContext(CartContext);
}

export default CartProvider;