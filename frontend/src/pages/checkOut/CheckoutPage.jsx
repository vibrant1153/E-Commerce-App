import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import React from 'react';
import './Checkout.css';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Get userId from wherever you store it after login
  // e.g. localStorage, context, or JWT decode
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.id;

  // Form state — the delivery address fields
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postcode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Updates the right field when user types
  // "name" comes from the input's name attribute
  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  // Called when user clicks "Place Order"
 async function handlePlaceOrder() {
  if (!userId) {
    navigate("/login");
    return;
  }

  if (!form.fullName || !form.address || !form.city || !form.postcode) {
    setError("Please fill in all address fields.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // ── Sync localStorage cart → DB first ──────────────────
    // This ensures DB has the latest cart before placing order
    // It runs even if user was already logged in, as a safety net
    for (const item of cart) {
      await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: item.id, quantity: item.quantity }),
      });
    }
    // ────────────────────────────────────────────────────────

    const res = await fetch("http://localhost:5000/api/orders/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    clearCart();
    navigate(`/order-confirmation/${data.orderId}`);

  } catch (err) {
    setError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-content">
          {/* ── Section 1: Delivery address ── */}
          <section className="checkout-section">
            <h2 className="section-label">Delivery address</h2>
            <div className="address-form">
              <input
                name="fullName"
                placeholder="Full name"
                value={form.fullName}
                onChange={handleChange}
                className="input-field"
              />
              <input
                name="address"
                placeholder="Street address"
                value={form.address}
                onChange={handleChange}
                className="input-field"
              />
              <div className="input-row">
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="input-field flex-grow"
                />
                <input
                  name="postcode"
                  placeholder="Postcode"
                  value={form.postcode}
                  onChange={handleChange}
                  className="input-field input-small"
                />
              </div>
            </div>
          </section>

          {/* ── Section 2: Order summary ── */}
          <section className="checkout-section">
            <h2 className="section-label">Order summary</h2>
            <div className="cart-card">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image || "https://placehold.co/48x48?text=img"}
                    alt={item.name}
                    className="item-image"
                    onError={e => { e.target.src = "https://placehold.co/48x48?text=img"; }}
                  />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="cart-total-row">
                <span className="total-label">Total</span>
                <span className="total-amount">${total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {error && <p className="error-message">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="place-order-btn"
          >
            {loading ? "Placing order..." : `Place Order · $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

