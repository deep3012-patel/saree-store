import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (error) {
      console.error("Fetch user error:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // ========== REGISTER FUNCTION - FIX THIS ==========
  const register = async (name, email, password) => {
    try {
      console.log("📝 Register attempt:", { name, email });

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        },
      );

      console.log("📥 Register response:", response.data);

      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem("token", response.data.data.token);
        // Set user in state
        setUser(response.data.data);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("❌ Register error:", error);

      if (error.response) {
        // Server responded with error
        return {
          success: false,
          message: error.response.data?.message || "Registration failed",
        };
      } else if (error.request) {
        // Request made but no response
        return {
          success: false,
          message:
            "Cannot connect to server. Make sure backend is running on port 5000",
        };
      } else {
        // Something else happened
        return {
          success: false,
          message: error.message || "Network error",
        };
      }
    }
  };
  // ================================================

  const login = async (email, password) => {
    try {
      console.log("🔑 Login attempt:", { email });

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      console.log("📥 Login response:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        setUser(response.data.data);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("❌ Login error:", error);
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || "Login failed",
        };
      }
      return { success: false, message: "Cannot connect to server" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
