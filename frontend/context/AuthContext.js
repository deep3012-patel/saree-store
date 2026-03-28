import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ========== ADD THIS - YOUR LIVE BACKEND URL ==========
const API_URL = "https://saree-store-api.onrender.com/api";
// =====================================================

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
      // FIXED: Use API_URL instead of localhost
      const res = await axios.get(`${API_URL}/auth/profile`, {
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

  const login = async (email, password) => {
    try {
      // FIXED: Use API_URL instead of localhost
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      // FIXED: Use API_URL instead of localhost
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
