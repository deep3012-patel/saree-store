import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  // Responsive styles
  const styles = {
    card: {
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "white",
      transition: "transform 0.3s, box-shadow 0.3s",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    imageContainer: {
      height: "clamp(180px, 40vw, 250px)",
      overflow: "hidden",
      backgroundColor: "#f5f5f5",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s",
    },
    discountBadge: {
      position: "absolute",
      top: "8px",
      right: "8px",
      backgroundColor: "#ff6b6b",
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "clamp(0.65rem, 3vw, 0.75rem)",
      fontWeight: "bold",
      zIndex: 1,
    },
    content: {
      padding: "clamp(0.7rem, 4vw, 1rem)",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    name: {
      fontSize: "clamp(0.9rem, 4vw, 1.1rem)",
      margin: "0 0 0.3rem",
      color: "#333",
      lineHeight: "1.3",
    },
    meta: {
      fontSize: "clamp(0.7rem, 3vw, 0.85rem)",
      color: "#666",
      marginBottom: "0.5rem",
    },
    priceContainer: {
      marginBottom: "0.8rem",
    },
    originalPrice: {
      textDecoration: "line-through",
      color: "#999",
      fontSize: "clamp(0.7rem, 3vw, 0.8rem)",
      marginRight: "0.5rem",
    },
    discountedPrice: {
      fontSize: "clamp(1rem, 4.5vw, 1.2rem)",
      fontWeight: "bold",
      color: "#9b2c1d",
    },
    price: {
      fontSize: "clamp(1rem, 4.5vw, 1.2rem)",
      fontWeight: "bold",
      color: "#9b2c1d",
    },
    quantityContainer: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "0.8rem",
      alignItems: "center",
      flexWrap: "wrap",
    },
    quantityLabel: {
      fontSize: "clamp(0.8rem, 3.5vw, 0.9rem)",
      color: "#666",
    },
    quantityInput: {
      width: "clamp(50px, 15vw, 60px)",
      padding: "0.4rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      textAlign: "center",
      fontSize: "clamp(0.8rem, 3.5vw, 0.9rem)",
    },
    buttonsContainer: {
      display: "flex",
      gap: "0.5rem",
      marginTop: "auto",
      flexWrap: "wrap",
    },
    viewBtn: {
      flex: "1 1 auto",
      padding: "0.5rem",
      backgroundColor: "#f5f5f5",
      color: "#333",
      textDecoration: "none",
      textAlign: "center",
      borderRadius: "4px",
      fontSize: "clamp(0.7rem, 3.5vw, 0.85rem)",
      transition: "background-color 0.3s",
    },
    cartBtn: {
      flex: "1 1 auto",
      padding: "0.5rem",
      backgroundColor: "#9b2c1d",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "clamp(0.7rem, 3.5vw, 0.85rem)",
      transition: "background-color 0.3s",
    },
    disabledBtn: {
      flex: "1 1 auto",
      padding: "0.5rem",
      backgroundColor: "#ccc",
      color: "#666",
      border: "none",
      borderRadius: "4px",
      cursor: "not-allowed",
      fontSize: "clamp(0.7rem, 3.5vw, 0.85rem)",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={
            product.image || "https://via.placeholder.com/300x400?text=Saree"
          }
          alt={product.name}
          style={styles.image}
        />
        {product.discount > 0 && (
          <span style={styles.discountBadge}>{product.discount}% OFF</span>
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.meta}>
          {product.material} | {product.color}
        </p>

        <div style={styles.priceContainer}>
          {product.discount > 0 ? (
            <>
              <span style={styles.originalPrice}>₹{product.price}</span>
              <span style={styles.discountedPrice}>₹{discountedPrice}</span>
            </>
          ) : (
            <span style={styles.price}>₹{product.price}</span>
          )}
        </div>

        {/* Quantity Selector */}
        <div style={styles.quantityContainer}>
          <span style={styles.quantityLabel}>Qty:</span>
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
            style={styles.quantityInput}
            disabled={product.stock === 0}
          />
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonsContainer}>
          <Link to={`/product/${product._id}`} style={styles.viewBtn}>
            View
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={product.stock === 0 ? styles.disabledBtn : styles.cartBtn}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
