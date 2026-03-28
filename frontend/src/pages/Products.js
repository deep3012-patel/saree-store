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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.2rem" }}>
        Loading beautiful sarees...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1
        style={{ textAlign: "center", color: "#9b2c1d", marginBottom: "2rem" }}
      >
        Our Beautiful Collection
      </h1>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search sarees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "200px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "0.5rem 1rem",
            background: "#9b2c1d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>

        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "100px",
          }}
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "100px",
          }}
        />
        <button
          onClick={handlePriceFilter}
          style={{
            padding: "0.5rem 1rem",
            background: "#666",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Filter
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          No sarees found. Add some products to your database!
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
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
