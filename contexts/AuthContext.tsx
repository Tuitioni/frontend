"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    if (!token) {
      console.error("No token provided to login function");
      return;
    }

    localStorage.setItem("admin_token", token);

    // Set secure cookie with proper attributes
    const secure = process.env.NODE_ENV === "production";
    document.cookie = `admin_token=${token}; path=/; ${
      secure ? "secure;" : ""
    } samesite=strict; max-age=86400`; // 24 hours
    console.log("Token set in cookies:", token);

    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    // Remove cookie with same attributes used when setting
    document.cookie = `admin_token=; path=/; ${
      process.env.NODE_ENV === "production" ? "secure;" : ""
    } samesite=strict; max-age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
