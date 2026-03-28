import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import OrderTracking from "../components/OrderTracking";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  // ONLY ONE getStatusColor FUNCTION - KEEP THIS
  const getStatusColor = (status) => {
    const colors = {
      pending: "#ff9800",
      processing: "#2196f3",
      shipped: "#9c27b0",
      delivered: "#4caf50",
      cancelled: "#f44336",
    };
    return colors[status] || "#666";
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <p>Please login to view your orders.</p>
        <Link to="/login" style={styles.link}>
          Login
        </Link>
      </div>
    );
  }

  if (loading) return <div style={styles.container}>Loading orders...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>
      {orders.length === 0 ? (
        <p>
          No orders yet. <Link to="/products">Start shopping</Link>
        </p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <span>
                  <strong>Order ID:</strong> {order._id}
                </span>
                <span>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span>
                  <strong>Status:</strong>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.orderStatus),
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </span>
              </div>
              <div style={styles.items}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.item}>
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={styles.orderFooter}>
                <strong>Total: ₹{order.totalAmount}</strong>
                <button
                  onClick={() => setTrackingOrder(order._id)}
                  style={styles.trackBtn}
                >
                  📍 Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      {trackingOrder && (
        <OrderTracking
          orderId={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
};

// ========== STYLES ONLY - NO DUPLICATE FUNCTION ==========
const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem" },
  title: { color: "#9b2c1d", marginBottom: "2rem" },
  orderCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  statusBadge: {
    display: "inline-block",
    padding: "0.2rem 0.5rem",
    borderRadius: "4px",
    color: "white",
    fontSize: "0.8rem",
    marginLeft: "0.5rem",
  },
  items: {
    borderTop: "1px solid #eee",
    paddingTop: "1rem",
    marginBottom: "1rem",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
  },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #eee",
    paddingTop: "1rem",
  },
  trackBtn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#9b2c1d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  link: { color: "#9b2c1d", textDecoration: "none" },
};

export default Orders;
