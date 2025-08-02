// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        return { success: true, user: data.user };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return { success: false };
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("wellnesshubUser");
    const token = localStorage.getItem("wellnesshubToken");

    const initialize = async () => {
      if (storedUser && token) {
        const result = await verifyToken(token);
        if (result.success) {
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem("wellnesshubUser");
          localStorage.removeItem("wellnesshubToken");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initialize();
  }, []);

  const signIn = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("wellnesshubUser", JSON.stringify(data.user));
        localStorage.setItem("wellnesshubToken", data.token);
        setUser(data.user);
        setAuthError(null);
        return { success: true };
      } else {
        setAuthError(data.message || "Login failed");
        return { success: false, error: data.message };
      }
    } catch (error) {
      setAuthError("Network error");
      return { success: false, error: "Network error" };
    }
  };

  const signOut = () => {
    localStorage.removeItem("wellnesshubUser");
    localStorage.removeItem("wellnesshubToken");
    setUser(null);
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, authError, clearError, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
