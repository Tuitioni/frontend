"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";
import { useEffect, useState } from "react";

export default function AuthButtons() {
  const { isAuthenticated, logout } = useAuth();
  const decodedToken = useToken();
  const role = decodedToken?.role;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR to prevent hydration errors
  if (!isClient) {
    return <div className="hidden md:flex gap-2"></div>;
  }

  return (
    <div className="hidden md:flex gap-2">
      {isAuthenticated ? (
        <>
          <Link
            href={
              role === "teacher"
                ? "/dashboard-teacher"
                : role === "student"
                ? "/dashboard-student"
                : "/admin-dashboard"
            }
          >
            <Button variant="default" className="px-4 py-2 bg-transparent">
              Dashboard
            </Button>
          </Link>
          <Button
            variant="default"
            className="px-4 py-2 bg-transparent"
            onClick={logout}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="default" className="px-4 py-2">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="default" className="px-4 py-2">
              Register
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
