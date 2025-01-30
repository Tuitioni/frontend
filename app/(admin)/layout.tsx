"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/ui/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && !pathname?.includes("/signin")) {
      router.replace("/signin");
    }
  }, [isAuthenticated, pathname, router]);

  // Don't show admin layout on signin page
  if (pathname?.includes("/signin")) {
    return <>{children}</>;
  }

  // Don't show anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  );
}
