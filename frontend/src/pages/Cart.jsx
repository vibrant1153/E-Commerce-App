// pages/CartPage.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./CartPage.css"; // Make sure to import your CSS file
import { useNavigate } from "react-router-dom";


export default function CartPage() {
  const { cart, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  // --- EMPTY STATE ---
  if (cart.length === 0) {
    return (
      <div className="cart-empty-state">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn-primary continue-shopping-btn">
          Continue shopping
        </Link>
      </div>
    );
  }

  // --- POPULATED CART STATE ---
  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        
        {/* Header */}
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Main Layout */}
        <div className="cart-layout">
          
          {/* LEFT SIDE (Items List) */}
          <div className="cart-items-section">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                
                {/* Image */}
                <div className="cart-item-image">
                  <img
                    src={item.image || "https://placehold.co/200x200"}
                    alt={item.name}
                  />
                </div>

                {/* Info & Controls */}
                <div className="cart-item-details">
                  
                  {/* Title & Mobile Price */}
                  <div className="cart-item-title-row">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price-mobile">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <p className="cart-item-unit-price">
                    ${Number(item.price).toFixed(2)} each
                  </p>

                  {/* Bottom Row: Quantity & Mobile Remove */}
                  <div className="cart-item-actions-bottom">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        −
                      </button>
                      <span className="quantity-display">
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn-remove-mobile"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Right-aligned Price & Remove (Desktop Only) */}
                <div className="cart-item-actions-desktop">
                  <p className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn-remove-desktop"
                  >
                    Remove
                  </button>
                </div>
                
              </div>
            ))}
          </div>

          {/* RIGHT SIDE (Order Summary) */}
          <div className="cart-summary-section">
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-value">${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="summary-value text-success">Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax estimate</span>
                  <span className="summary-value">$0.00</span>
                </div>
              </div>

              <div className="summary-total-row">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="summary-actions">
                <button className="btn-primary checkout-btn"  
                onClick={() => navigate("/checkout")}>

                  Checkout

                </button>
                <button
                  onClick={clearCart}
                  className="btn-secondary clear-cart-btn"
                >
                  Clear Cart
                </button>
              </div>

              <Link to="/" className="back-link">
                <span>←</span> Continue shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}