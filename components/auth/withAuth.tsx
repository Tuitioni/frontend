"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace("/signin");
      }
    }, [isAuthenticated, router]);

    // Don't render anything if not authenticated
    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
