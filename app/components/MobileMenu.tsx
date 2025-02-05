"use client"; // Mark this as a client component

import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Lucide icons
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  className?: string;
}

export default function MobileMenu({ className }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle clicks outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    const menu = document.getElementById("mobile-menu");
    if (menu && !menu.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  // Effect to add/remove event listener
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`md:hidden flex items-center ${className || ""}`}>
      {/* Hamburger Icon */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 focus:outline-none"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="absolute top-14 right-0 bg-white shadow-md p-4 w-48 rounded-lg z-10">
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
