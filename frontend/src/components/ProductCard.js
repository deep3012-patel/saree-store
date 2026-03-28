import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      <div style={{ height: "250px", overflow: "hidden" }}>
        <img
          src={
            product.image || "https://via.placeholder.com/300x400?text=Saree"
          }
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: "1rem" }}>
        <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
          {product.name}
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          {product.material} | {product.color}
        </p>
        <div style={{ marginBottom: "1rem" }}>
          {product.discount > 0 ? (
            <>
              <span style={{ textDecoration: "line-through", color: "#999" }}>
                ₹{product.price}
              </span>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#9b2c1d",
                  marginLeft: "0.5rem",
                }}
              >
                ₹{discountedPrice}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#9b2c1d",
              }}
            >
              ₹{product.price}
            </span>
          )}
        </div>

        {/* ========== QUANTITY SELECTOR - ADDED HERE ========== */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Qty:</span>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(
                  product.stock,
                  Math.max(1, parseInt(e.target.value) || 1),
                ),
              )
            }
            style={{
              width: "60px",
              padding: "0.4rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
            disabled={product.stock === 0}
          />
        </div>
        {/* ================================================== */}

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            to={`/product/${product._id}`}
            style={{
              flex: 1,
              padding: "0.5rem",
              backgroundColor: "#f5f5f5",
              color: "#333",
              textDecoration: "none",
              textAlign: "center",
              borderRadius: "4px",
            }}
          >
            View
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              flex: 1,
              padding: "0.5rem",
              backgroundColor: product.stock === 0 ? "#ccc" : "#9b2c1d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
