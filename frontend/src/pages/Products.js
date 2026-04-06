import React, { useState, useEffect } from "react";
import { getAllSarees, searchSarees, filterByPrice } from "../services/api";
import ProductCard from "../components/ProductCard";

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllSarees(1, 50);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search) return fetchProducts();
    setLoading(true);
    try {
      const res = await searchSarees(search);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const handlePriceFilter = async () => {
    setLoading(true);
    try {
      const res = await filterByPrice(minPrice || 0, maxPrice || 100000);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  // Responsive styles
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "1rem",
    },
    title: {
      textAlign: "center",
      color: "#9b2c1d",
      marginBottom: "1.5rem",
      fontSize: "clamp(1.5rem, 5vw, 2rem)",
    },
    filtersContainer: {
      display: "flex",
      gap: "0.8rem",
      marginBottom: "2rem",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
    },
    searchInput: {
      padding: "0.6rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      width: "clamp(150px, 40vw, 200px)",
      fontSize: "0.9rem",
    },
    priceInput: {
      padding: "0.6rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      width: "clamp(80px, 20vw, 100px)",
      fontSize: "0.9rem",
    },
    searchBtn: {
      padding: "0.6rem 1rem",
      background: "#9b2c1d",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    filterBtn: {
      padding: "0.6rem 1rem",
      background: "#666",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.5rem",
    },
    loadingText: {
      textAlign: "center",
      padding: "3rem",
      fontSize: "1.2rem",
      color: "#666",
    },
    noProducts: {
      textAlign: "center",
      padding: "3rem",
      color: "#666",
    },
  };

  if (loading) {
    return <div style={styles.loadingText}>Loading beautiful sarees...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Our Beautiful Collection</h1>

      {/* Filters Section */}
      <div style={styles.filtersContainer}>
        <input
          type="text"
          placeholder="Search sarees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchBtn}>
          Search
        </button>

        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={styles.priceInput}
        />
        <span style={{ color: "#666" }}>-</span>
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={styles.priceInput}
        />
        <button onClick={handlePriceFilter} style={styles.filterBtn}>
          Filter
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={styles.noProducts}>
          No sarees found. Add some products to your database!
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
