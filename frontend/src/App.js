import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import AdminDashboard from './components/AdminDashboard';  // ✅ Already imported

function AppContent() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        return prev.map(i => 
          i._id === product._id 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      }
      return [...prev, { ...product, quantity: quantity }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i._id !== id));

  const updateQuantity = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else
      setCart((prev) =>
        prev.map((i) => (i._id === id ? { ...i, quantity: qty } : i)),
      );
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Navbar cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={<Products addToCart={addToCart} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          
          {/* ========== ADD THIS ADMIN ROUTE ========== */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ========================================= */}
        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;