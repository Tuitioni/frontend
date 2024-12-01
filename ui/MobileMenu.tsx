"use client"; // Mark this as a client component

import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Lucide icons
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      {/* Hamburger Icon */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 focus:outline-none"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 right-0 bg-white shadow-md p-4 w-48 rounded-lg z-10">
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button variant="default" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="default" className="w-full">
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
