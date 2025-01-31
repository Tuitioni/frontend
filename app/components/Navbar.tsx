"use client";

import React from "react";
import Logo from "./navbar/Logo";
import MobileMenu from "./MobileMenu";
import NavbarButtons from "./NavbarButtons";
import AuthButtons from "./navbar/AuthButtons";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-bluishGrey border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        <Logo />

        <div className="flex items-center gap-4">
          <NavbarButtons />
          <AuthButtons />
          <MobileMenu className="md:hidden" />
        </div>
      </div>
    </nav>
  );
}
