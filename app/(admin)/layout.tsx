"use client";

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { cn } from "@/lib/utils";
import Sidebar from "@/components/ui/admin/sideBar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/signin");
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="flex flex-row min-h-screen w-full">
          <Sidebar />
          <main className="flex-1 p-8 flex justify-center">{children}</main>
        </div>
      </body>
    </html>
  );
}
