import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Responsive styles
  const styles = {
    hero: {
      background: "linear-gradient(135deg, #9b2c1d, #d4451e)",
      color: "white",
      textAlign: "center",
      padding: "clamp(2rem, 10vw, 4rem) clamp(1rem, 5vw, 2rem)",
    },
    title: {
      fontSize: "clamp(1.8rem, 6vw, 3rem)",
      marginBottom: "0.5rem",
    },
    subtitle: {
      fontSize: "clamp(0.9rem, 4vw, 1.2rem)",
      marginBottom: "1.5rem",
    },
    shopBtn: {
      display: "inline-block",
      padding: "0.8rem 1.5rem",
      background: "white",
      color: "#9b2c1d",
      textDecoration: "none",
      borderRadius: "50px",
      marginTop: "1rem",
      fontWeight: "bold",
      fontSize: "clamp(0.9rem, 4vw, 1rem)",
      transition: "transform 0.3s",
    },
    featuresContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "clamp(1rem, 4vw, 2rem)",
      padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 2rem)",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    feature: {
      textAlign: "center",
      padding: "1rem",
    },
    icon: {
      fontSize: "clamp(2rem, 8vw, 3rem)",
      display: "block",
      marginBottom: "0.8rem",
    },
    featureTitle: {
      fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
      marginBottom: "0.5rem",
      color: "#333",
    },
    featureText: {
      fontSize: "clamp(0.8rem, 3.5vw, 0.9rem)",
      color: "#666",
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Discover Elegant Sarees</h1>
        <p style={styles.subtitle}>
          Traditional handcrafted sarees from across India
        </p>
        <Link to="/products" style={styles.shopBtn}>
          Shop Now →
        </Link>
      </div>

      {/* Features Section */}
      <div style={styles.featuresContainer}>
        <div style={styles.feature}>
          <span style={styles.icon}>🪔</span>
          <h3 style={styles.featureTitle}>Authentic Designs</h3>
          <p style={styles.featureText}>
            Traditional patterns passed down through generations
          </p>
        </div>
        <div style={styles.feature}>
          <span style={styles.icon}>✨</span>
          <h3 style={styles.featureTitle}>Premium Quality</h3>
          <p style={styles.featureText}>
            Finest materials from renowned weaving communities
          </p>
        </div>
        <div style={styles.feature}>
          <span style={styles.icon}>🚚</span>
          <h3 style={styles.featureTitle}>Free Shipping</h3>
          <p style={styles.featureText}>Free delivery on orders above ₹2000</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
