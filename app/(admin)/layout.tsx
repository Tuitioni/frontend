import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import Sidebar from "@/components/ui/admin/sidebar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex flex-col min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
