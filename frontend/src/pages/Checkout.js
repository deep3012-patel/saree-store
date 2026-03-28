import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
  },
  formSection: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "2rem",
  },
  summarySection: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "2rem",
    height: "fit-content",
  },
  sectionTitle: {
    color: "#9b2c1d",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  submitBtn: {
    padding: "1rem",
    backgroundColor: "#9b2c1d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #eee",
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
    paddingTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  totalAmount: {
    color: "#9b2c1d",
  },
  emptyCart: {
    textAlign: "center",
    padding: "4rem",
  },
  shopBtn: {
    padding: "1rem 2rem",
    backgroundColor: "#9b2c1d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

const Checkout = ({ cart }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => {
    const price = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        items: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
        })),
        shippingAddress: form,
        totalAmount: total,
      };

      const res = await axios.post(
        "https://saree-store-api.onrender.com/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("cart");
        navigate("/orders");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/products")} style={styles.shopBtn}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Shipping Details</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Address"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="City"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Pincode"
            required
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            style={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
      <div style={styles.summarySection}>
        <h2 style={styles.sectionTitle}>Order Summary</h2>
        {cart.map((item) => {
          const price = item.discount
            ? item.price - (item.price * item.discount) / 100
            : item.price;
          return (
            <div key={item._id} style={styles.summaryItem}>
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₹{price * item.quantity}</span>
            </div>
          );
        })}
        <div style={styles.total}>
          <span>Total:</span>
          <span style={styles.totalAmount}>₹{total}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
