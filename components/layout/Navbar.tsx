'use client';

import React from 'react';

import MobileMenu from './MobileMenu';
import AuthButtons from './navbar/AuthButtons';
import Logo from './navbar/Logo';
import NavbarButtons from './NavbarButtons';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-3">
          <NavbarButtons />
          <NotificationBell />
          <AuthButtons />
          <ThemeToggle />
          <MobileMenu className="md:hidden" />
        </div>
      </div>
    </nav>
  );
}
