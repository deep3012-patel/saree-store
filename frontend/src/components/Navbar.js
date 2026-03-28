import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ cartCount }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const styles = {
    navbar: { background: "#9b2c1d", padding: "1rem 2rem" },
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    logo: {
      color: "white",
      fontSize: "1.5rem",
      textDecoration: "none",
      fontWeight: "bold",
    },
    navLinks: {
      display: "flex",
      gap: "2rem",
      alignItems: "center",
      flexWrap: "wrap",
    },
    link: { color: "white", textDecoration: "none" },
    cartLink: { color: "white", textDecoration: "none", position: "relative" },
    badge: {
      background: "#ff6b6b",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "12px",
      marginLeft: "5px",
    },
    userInfo: { display: "flex", gap: "1rem", alignItems: "center" },
    userName: { color: "white" },
    logoutBtn: {
      background: "transparent",
      border: "1px solid white",
      color: "white",
      padding: "0.3rem 0.8rem",
      borderRadius: "4px",
      cursor: "pointer",
    },
    // Add this style for admin link
    adminLink: {
      color: "#ffd700",
      textDecoration: "none",
      fontWeight: "bold",
      backgroundColor: "rgba(255,255,255,0.2)",
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🪔 Saree Store
        </Link>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/products" style={styles.link}>
            Products
          </Link>

          {/* ========== ADD ADMIN LINK FOR ADMIN USERS ========== */}
          {user && user.role === "admin" && (
            <Link to="/admin" style={styles.adminLink}>
              📊 Admin Panel
            </Link>
          )}
          {/* =================================================== */}

          {user && (
            <Link to="/orders" style={styles.link}>
              My Orders
            </Link>
          )}
          <Link to="/cart" style={styles.cartLink}>
            🛒 Cart{" "}
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>
          {user ? (
            <div style={styles.userInfo}>
              <span style={styles.userName}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
