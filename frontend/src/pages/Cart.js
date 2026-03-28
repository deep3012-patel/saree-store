import React from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";

const Cart = ({ cart, updateQuantity, removeFromCart }) => {
  const total = cart.reduce((sum, item) => {
    const price = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h2>Your Cart is Empty 🛒</h2>
        <Link
          to="/products"
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            background: "#9b2c1d",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            marginTop: "1rem",
          }}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ color: "#9b2c1d" }}>Shopping Cart</h1>
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}
      >
        <div>
          {cart.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1.5rem",
            height: "fit-content",
          }}
        >
          <h3>Order Summary</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "1rem 0",
            }}
          >
            <span>Total Items:</span>
            <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "1rem 0",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            <span>Total Amount:</span>
            <span style={{ color: "#9b2c1d" }}>₹{total}</span>
          </div>
          <Link
            to="/checkout"
            style={{
              display: "block",
              textAlign: "center",
              padding: "1rem",
              background: "#9b2c1d",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Proceed to Checkout →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
