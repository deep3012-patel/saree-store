import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderTracking = ({ orderId, onClose }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  // FIXED: fetchTracking is now inside useEffect
  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://saree-store-api.onrender.com/api/orders/${orderId}/tracking`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTracking(res.data.data);
      } catch (error) {
        toast.error("Failed to load tracking info");
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [orderId]); // ✅ No more warning!

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

  const getStatusStep = (status) => {
    const steps = ["pending", "processing", "shipped", "delivered"];
    const index = steps.indexOf(status);
    return index !== -1 ? index + 1 : 0;
  };

  if (loading)
    return <div style={styles.loading}>Loading tracking info...</div>;
  if (!tracking) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          ✕
        </button>

        <h2 style={styles.title}>📦 Order Tracking</h2>

        {/* Order Info */}
        <div style={styles.orderInfo}>
          <p>
            <strong>Order ID:</strong> {tracking.orderId}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(tracking.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Total:</strong> ₹{tracking.totalAmount}
          </p>
        </div>

        {/* Status Progress Bar */}
        <div style={styles.progressContainer}>
          {["pending", "processing", "shipped", "delivered"].map(
            (step, idx) => (
              <div key={step} style={styles.progressStep}>
                <div
                  style={{
                    ...styles.stepCircle,
                    backgroundColor:
                      getStatusStep(tracking.status) > idx
                        ? "#4caf50"
                        : getStatusStep(tracking.status) === idx + 1
                          ? getStatusColor(tracking.status)
                          : "#ddd",
                  }}
                >
                  {getStatusStep(tracking.status) > idx ? "✓" : idx + 1}
                </div>
                <span style={styles.stepLabel}>
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
              </div>
            ),
          )}
        </div>

        {/* Current Status */}
        <div style={styles.statusCard}>
          <h3>Current Status</h3>
          <span
            style={{
              ...styles.statusBadge,
              backgroundColor: getStatusColor(tracking.status),
            }}
          >
            {tracking.status.toUpperCase()}
          </span>
          {tracking.trackingNumber && (
            <p>
              <strong>Tracking Number:</strong> {tracking.trackingNumber}
            </p>
          )}
          {tracking.estimatedDelivery && (
            <p>
              <strong>Estimated Delivery:</strong>{" "}
              {new Date(tracking.estimatedDelivery).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Status History */}
        <div style={styles.history}>
          <h3>Status History</h3>
          {tracking.statusHistory.map((item, idx) => (
            <div key={idx} style={styles.historyItem}>
              <div style={styles.historyDot}></div>
              <div style={styles.historyContent}>
                <strong>{item.status.toUpperCase()}</strong>
                <p>{item.note}</p>
                <small>{new Date(item.updatedAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#666",
  },
  title: {
    color: "#9b2c1d",
    marginBottom: "1.5rem",
  },
  orderInfo: {
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  },
  progressContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  progressStep: {
    textAlign: "center",
    flex: 1,
  },
  stepCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 0.5rem",
    color: "white",
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: "0.8rem",
    color: "#666",
  },
  statusCard: {
    backgroundColor: "#f5f5f5",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  },
  statusBadge: {
    display: "inline-block",
    padding: "0.3rem 0.8rem",
    borderRadius: "20px",
    color: "white",
    fontSize: "0.8rem",
    marginLeft: "0.5rem",
  },
  history: {
    marginTop: "1rem",
  },
  historyItem: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
    paddingLeft: "1rem",
    borderLeft: "2px solid #eee",
  },
  historyDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#9b2c1d",
    marginTop: "0.3rem",
  },
  historyContent: {
    flex: 1,
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
  },
};

export default OrderTracking;
