import React from "react";

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const price = item.discount
    ? item.price - (item.price * item.discount) / 100
    : item.price;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 2fr 120px 100px 50px",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        borderBottom: "1px solid #eee",
      }}
    >
      <img
        src={item.image || "https://via.placeholder.com/80"}
        alt={item.name}
        style={{
          width: "80px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
      <div>
        <h4>{item.name}</h4>
        <p style={{ color: "#666" }}>
          {item.material} | {item.color}
        </p>
        <p style={{ color: "#9b2c1d", fontWeight: "bold" }}>₹{price}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          style={{
            width: "30px",
            height: "30px",
            background: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          style={{
            width: "30px",
            height: "30px",
            background: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>
      <div style={{ fontWeight: "bold" }}>₹{price * item.quantity}</div>
      <button
        onClick={() => removeFromCart(item._id)}
        style={{
          background: "none",
          border: "none",
          fontSize: "1.2rem",
          cursor: "pointer",
        }}
      >
        🗑️
      </button>
    </div>
  );
};

export default CartItem;
