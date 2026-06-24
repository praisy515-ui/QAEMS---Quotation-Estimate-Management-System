import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:5000/api/v1" : "/api/v1");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("qaems_user")) || null
  );
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setUser(data.data.user);
        localStorage.setItem("qaems_user", JSON.stringify(data.data.user));
        localStorage.setItem("qaems_token", data.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("qaems_user");
    localStorage.removeItem("qaems_token");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);