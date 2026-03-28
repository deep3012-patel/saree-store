import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #9b2c1d, #d4451e)",
          color: "white",
          textAlign: "center",
          padding: "4rem 2rem",
        }}
      >
        <h1 style={{ fontSize: "3rem" }}>Discover Elegant Sarees</h1>
        <p style={{ fontSize: "1.2rem" }}>
          Traditional handcrafted sarees from across India
        </p>
        <Link
          to="/products"
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            background: "white",
            color: "#9b2c1d",
            textDecoration: "none",
            borderRadius: "50px",
            marginTop: "1rem",
          }}
        >
          Shop Now →
        </Link>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          padding: "4rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "3rem" }}>🪔</span>
          <h3>Authentic Designs</h3>
          <p>Traditional patterns</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "3rem" }}>✨</span>
          <h3>Premium Quality</h3>
          <p>Finest materials</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "3rem" }}>🚚</span>
          <h3>Free Shipping</h3>
          <p>On orders ₹2000+</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
