import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ cartCount }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const styles = {
    navbar: {
      background: "#9b2c1d",
      padding: "0.8rem 1rem",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
      flexWrap: "wrap",
    },
    logo: {
      color: "white",
      fontSize: "1.3rem",
      textDecoration: "none",
      fontWeight: "bold",
    },
    menuIcon: {
      display: "none",
      fontSize: "1.8rem",
      color: "white",
      cursor: "pointer",
      background: "none",
      border: "none",
    },
    navLinks: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
      flexWrap: "wrap",
    },
    navLinksMobile: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      gap: "0.8rem",
      padding: "1rem 0",
      marginTop: "0.8rem",
      borderTop: "1px solid rgba(255,255,255,0.2)",
    },
    link: {
      color: "white",
      textDecoration: "none",
      padding: "0.3rem 0",
    },
    cartLink: {
      color: "white",
      textDecoration: "none",
      position: "relative",
    },
    badge: {
      background: "#ff6b6b",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "11px",
      marginLeft: "5px",
    },
    userInfo: {
      display: "flex",
      gap: "0.8rem",
      alignItems: "center",
      flexWrap: "wrap",
    },
    userName: {
      color: "white",
      fontSize: "0.9rem",
    },
    logoutBtn: {
      background: "transparent",
      border: "1px solid white",
      color: "white",
      padding: "0.3rem 0.8rem",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    adminLink: {
      color: "#ffd700",
      textDecoration: "none",
      fontWeight: "bold",
      backgroundColor: "rgba(255,255,255,0.2)",
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
    },
  };

  // Mobile menu icon visible on small screens
  const mobileStyles = `
    @media (max-width: 768px) {
      .menu-icon { display: block !important; }
      .nav-links { display: none !important; }
      .nav-links.open { display: flex !important; }
    }
    @media (min-width: 769px) {
      .nav-links { display: flex !important; }
    }
  `;

  return (
    <nav style={styles.navbar}>
      <style>{mobileStyles}</style>
      <div style={styles.container}>
        <Link to="/" style={styles.logo} onClick={() => setIsMenuOpen(false)}>
          🪔 Saree Store
        </Link>

        <button
          className="menu-icon"
          style={styles.menuIcon}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div
          className={`nav-links ${isMenuOpen ? "open" : ""}`}
          style={isMenuOpen ? styles.navLinksMobile : styles.navLinks}
        >
          <Link to="/" style={styles.link} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link
            to="/products"
            style={styles.link}
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>

          {user && user.role === "admin" && (
            <Link
              to="/admin"
              style={styles.adminLink}
              onClick={() => setIsMenuOpen(false)}
            >
              📊 Admin
            </Link>
          )}

          {user && (
            <Link
              to="/wishlist"
              style={styles.link}
              onClick={() => setIsMenuOpen(false)}
            >
              ❤️ Wishlist
            </Link>
          )}

          {user && (
            <Link
              to="/profile"
              style={styles.link}
              onClick={() => setIsMenuOpen(false)}
            >
              👤 Profile
            </Link>
          )}

          {user && (
            <Link
              to="/orders"
              style={styles.link}
              onClick={() => setIsMenuOpen(false)}
            >
              My Orders
            </Link>
          )}

          <Link
            to="/cart"
            style={styles.cartLink}
            onClick={() => setIsMenuOpen(false)}
          >
            🛒 Cart{" "}
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>

          {user ? (
            <div style={styles.userInfo}>
              <span style={styles.userName}>👤 {user.name?.split(" ")[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.link}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={styles.link}
                onClick={() => setIsMenuOpen(false)}
              >
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
