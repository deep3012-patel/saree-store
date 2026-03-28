import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ productId, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/sarees/${productId}/related`,
        );
        setProducts(res.data.data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRelated();
    }
  }, [productId]);

  if (loading) {
    return <div style={styles.loading}>Loading related products...</div>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>✨ You May Also Like</h3>
      <div style={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "3rem",
    paddingTop: "2rem",
    borderTop: "2px solid #eee",
  },
  title: {
    fontSize: "1.5rem",
    color: "#9b2c1d",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
    color: "#666",
  },
};

export default RelatedProducts;
