import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [statsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/orders/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setStats(statsRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/admin/orders/${orderId}/status`,
        { status, note: `Status updated to ${status} by admin` },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Order status updated");
      fetchData();
      setSelectedOrder(null);
      setNewStatus("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

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

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <h3>Total Orders</h3>
          <p style={styles.statNumber}>{stats?.totalOrders || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <h3>Total Users</h3>
          <p style={styles.statNumber}>{stats?.totalUsers || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🛍️</div>
          <h3>Total Products</h3>
          <p style={styles.statNumber}>{stats?.totalProducts || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <h3>Total Revenue</h3>
          <p style={styles.statNumber}>
            ₹{stats?.totalRevenue?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Orders by Status */}
      <div style={styles.statusSection}>
        <h2>Orders by Status</h2>
        <div style={styles.statusGrid}>
          {stats?.ordersByStatus?.map((item) => (
            <div
              key={item._id}
              style={{
                ...styles.statusItem,
                backgroundColor: getStatusColor(item._id),
              }}
            >
              <span>{item._id.toUpperCase()}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={styles.ordersSection}>
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.user?.name || "Guest"}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.items.length} items</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(order.orderStatus),
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={styles.updateBtn}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {selectedOrder && (
        <div style={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Update Order Status</h3>
            <div style={styles.modalOrderInfo}>
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder.user?.name || "Guest"}
              </p>
              <p>
                <strong>Current Status:</strong>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(selectedOrder.orderStatus),
                    marginLeft: "8px",
                  }}
                >
                  {selectedOrder.orderStatus}
                </span>
              </p>
            </div>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={styles.select}
            >
              <option value="">Select New Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div style={styles.modalButtons}>
              <button
                onClick={() => updateOrderStatus(selectedOrder._id, newStatus)}
                disabled={!newStatus}
                style={{ ...styles.confirmBtn, opacity: !newStatus ? 0.5 : 1 }}
              >
                Confirm Update
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem" },
  title: { color: "#9b2c1d", marginBottom: "2rem", fontSize: "2rem" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  statCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.3s",
  },
  statIcon: { fontSize: "2.5rem", marginBottom: "0.5rem" },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#9b2c1d",
    marginTop: "0.5rem",
  },
  statusSection: { marginBottom: "2rem" },
  statusGrid: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  },
  statusItem: {
    flex: 1,
    padding: "1rem",
    borderRadius: "8px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: "100px",
  },
  ordersSection: { marginTop: "2rem" },
  tableContainer: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  th: {
    padding: "1rem",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  td: { padding: "1rem", borderBottom: "1px solid #eee" },
  statusBadge: {
    display: "inline-block",
    padding: "0.3rem 0.8rem",
    borderRadius: "20px",
    color: "white",
    fontSize: "0.8rem",
  },
  updateBtn: {
    padding: "0.4rem 1rem",
    backgroundColor: "#9b2c1d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modalOverlay: {
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
    padding: "2rem",
    borderRadius: "12px",
    width: "450px",
    maxWidth: "90%",
  },
  modalOrderInfo: {
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    borderRadius: "8px",
    margin: "1rem 0",
  },
  select: {
    width: "100%",
    padding: "0.8rem",
    margin: "1rem 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
  },
  modalButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    marginTop: "1rem",
  },
  confirmBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    padding: "4rem",
    fontSize: "1.2rem",
    color: "#666",
  },
};

export default AdminDashboard;
