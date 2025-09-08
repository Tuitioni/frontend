"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  const checkTokenExpiration = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setIsAuthenticated(false);
        if (window.location.pathname.startsWith("/admin-dashboard")) {
          router.replace("/signin");
        }
        return;
      }

      if (!checkTokenExpiration(token)) {
        // Token is expired or invalid
        localStorage.removeItem("admin_token");
        document.cookie =
          "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        setIsAuthenticated(false);
        if (window.location.pathname.startsWith("/admin-dashboard")) {
          router.replace("/signin");
        }
        return;
      }

      setIsAuthenticated(true);
    };

    // Check auth on mount and set up interval to check periodically
    checkAuth();
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [router]);

  const login = (token: string) => {
    if (!token) {
      console.error("No token provided to login function");
      return;
    }

    if (!checkTokenExpiration(token)) {
      console.error("Token is expired or invalid");
      logout();
      return;
    }

    try {
      const decodedToken = jwtDecode<JWTPayload>(token);
      localStorage.setItem("admin_token", token);

      // Set secure cookie with proper attributes
      const secure = process.env.NODE_ENV === "production";
      document.cookie = `admin_token=${token}; path=/; ${
        secure ? "secure;" : ""
      } samesite=strict; max-age=${decodedToken.exp - Date.now() / 1000}`; // Set max-age to remaining time

      setIsAuthenticated(true);
      router.push("/admin-dashboard");
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  };

  const logout = () => {
    // Clear authentication state
    localStorage.removeItem("admin_token");
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setIsAuthenticated(false);

    // Immediate redirect to signin
    router.replace("/signin");
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
