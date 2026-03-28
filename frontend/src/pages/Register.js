import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      toast.success("Registration successful!");
      navigate("/");
    } else {
      toast.error(result.message || "Registration failed");
    }
    setLoading(false);
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      padding: "2rem",
    },
    card: {
      background: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
    },
    title: { textAlign: "center", color: "#9b2c1d", marginBottom: "2rem" },
    form: { display: "flex", flexDirection: "column", gap: "1rem" },
    input: {
      padding: "0.8rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "1rem",
    },
    button: {
      padding: "0.8rem",
      backgroundColor: "#9b2c1d",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "1rem",
      cursor: "pointer",
    },
    linkText: { textAlign: "center", marginTop: "1rem" },
    link: { color: "#9b2c1d", textDecoration: "none" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={styles.linkText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
