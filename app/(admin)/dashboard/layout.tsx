"use client";

import { withAuth } from "@/components/auth/withAuth";
import { handleTokenError } from "@/utils/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  // Create a wrapper for API calls that handles token validation
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("jwt expired");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error: any) {
      handleTokenError(error);
      throw error;
    }
  };

  // Add fetchWithAuth to window object so it's available throughout the app
  if (typeof window !== "undefined") {
    (window as any).fetchWithAuth = fetchWithAuth;
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}

export default withAuth(DashboardLayout);
