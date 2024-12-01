import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu"; // Import MobileMenu
import NavbarButtons from "./NavbarButtons";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-2 sm:px-4 xl:px-8 py-2 border-b">
      {/* Logo */}
      <Link href="/home" className="w-[50px] md:w-[100px] cursor-pointer">
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={50}
          height={50}
          layout="responsive"
        />
      </Link>
      <div>
        <NavbarButtons />
      </div>
      {/* Login & Register for larger screens */}
      <div className="hidden md:flex gap-1 sm:gap-2">
        <Link href="/login">
          <Button variant="default" className="px-1 py-1 md:px-4 md:py-2 h-9">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="default" className="px-1 py-1 md:px-4 md:py-2 h-9">
            Register
          </Button>
        </Link>
      </div>

      {/* Mobile Menu */}
      <MobileMenu />
    </div>
  );
}
