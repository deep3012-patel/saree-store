import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSareeById } from "../services/api";
import { toast } from "react-toastify";
import Review from "../components/Review";
import RelatedProducts from "../components/RelatedProducts";

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Move loadProduct outside useEffect so it can be referenced
  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await getSareeById(id);
      setProduct(res.data);
    } catch (error) {
      console.error("Error loading product:", error);
    }
    setLoading(false);
  };

  // Fix: Add loadProduct to dependency array
  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // id is the only dependency, loadProduct is defined inside

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>
    );
  if (!product)
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        Product not found
      </div>
    );

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const styles = {
    container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem" },
    backBtn: {
      marginBottom: "1rem",
      padding: "0.5rem 1rem",
      cursor: "pointer",
      backgroundColor: "#f5f5f5",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    productContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "3rem",
    },
    image: { width: "100%", borderRadius: "8px", objectFit: "cover" },
    name: { color: "#333", fontSize: "1.8rem", marginBottom: "0.5rem" },
    meta: { color: "#666", marginBottom: "1rem" },
    priceContainer: { margin: "1rem 0" },
    originalPrice: {
      textDecoration: "line-through",
      color: "#999",
      fontSize: "1.2rem",
    },
    discountedPrice: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#9b2c1d",
      marginLeft: "1rem",
    },
    price: { fontSize: "2rem", fontWeight: "bold", color: "#9b2c1d" },
    discountBadge: {
      background: "#ff6b6b",
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      marginLeft: "1rem",
      fontSize: "0.9rem",
    },
    description: { margin: "1rem 0", lineHeight: "1.6", color: "#555" },
    details: {
      margin: "1rem 0",
      backgroundColor: "#f9f9f9",
      padding: "1rem",
      borderRadius: "8px",
    },
    addToCartBtn: {
      width: "100%",
      padding: "1rem",
      background: product.stock === 0 ? "#ccc" : "#9b2c1d",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      cursor: product.stock === 0 ? "not-allowed" : "pointer",
      fontWeight: "bold",
      marginTop: "1rem",
    },
    reviewsSection: {
      marginTop: "4rem",
      borderTop: "2px solid #eee",
      paddingTop: "2rem",
    },
    reviewsTitle: {
      color: "#9b2c1d",
      marginBottom: "1.5rem",
      fontSize: "1.5rem",
    },
    reviewCard: {
      borderBottom: "1px solid #eee",
      padding: "1rem 0",
      marginBottom: "0.5rem",
    },
    reviewHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.5rem",
      flexWrap: "wrap",
      gap: "0.5rem",
    },
    reviewerName: {
      fontWeight: "bold",
      color: "#333",
    },
    reviewRating: {
      color: "#ff9800",
    },
    reviewComment: {
      color: "#666",
      lineHeight: "1.5",
      marginBottom: "0.5rem",
    },
    reviewDate: {
      color: "#999",
      fontSize: "0.8rem",
    },
    noReviews: {
      color: "#666",
      textAlign: "center",
      padding: "2rem",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
    },
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>
      <div style={styles.productContainer}>
        <img
          src={
            product.image || "https://via.placeholder.com/400x500?text=Saree"
          }
          alt={product.name}
          style={styles.image}
        />
        <div>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.meta}>
            {product.material} | {product.color}
          </p>
          <div style={styles.priceContainer}>
            {product.discount > 0 ? (
              <>
                <span style={styles.originalPrice}>₹{product.price}</span>
                <span style={styles.discountedPrice}>₹{discountedPrice}</span>
                <span style={styles.discountBadge}>
                  {product.discount}% OFF
                </span>
              </>
            ) : (
              <span style={styles.price}>₹{product.price}</span>
            )}
          </div>
          <p style={styles.description}>
            {product.description || "Beautiful saree with traditional design."}
          </p>
          <div style={styles.details}>
            <p>
              <strong>📂 Category:</strong> {product.category || "Casual"}
            </p>
            <p>
              <strong>📦 Stock:</strong>{" "}
              {product.stock > 0
                ? `${product.stock} pieces available`
                : "Out of stock"}
            </p>
            <p>
              <strong>⭐ Rating:</strong>{" "}
              {"⭐".repeat(
                Math.floor(product.averageRating || product.rating || 0),
              )}{" "}
              {(product.averageRating || product.rating || 0).toFixed(1)} / 5
            </p>
          </div>
          <button
            onClick={() => {
              addToCart(product);
              toast.success("Added to cart! 🛒");
            }}
            disabled={product.stock === 0}
            style={styles.addToCartBtn}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart 🛒"}
          </button>
        </div>
      </div>

      {/* ========== REVIEWS SECTION ========== */}
      <div style={styles.reviewsSection}>
        <h3 style={styles.reviewsTitle}>⭐ Customer Reviews</h3>

        <RelatedProducts productId={product._id} addToCart={addToCart} />

        {/* Display existing reviews */}
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <span style={styles.reviewerName}>{review.userName}</span>
                <span style={styles.reviewRating}>
                  {"★".repeat(review.rating)} ({review.rating}/5)
                </span>
              </div>
              <p style={styles.reviewComment}>{review.comment}</p>
              <small style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <div style={styles.noReviews}>
            📝 No reviews yet. Be the first to review this beautiful saree!
          </div>
        )}

        {/* Add Review Form - Review component IS used here */}
        <Review productId={product._id} onReviewAdded={loadProduct} />
      </div>
    </div>
  );
};

export default ProductDetail;
