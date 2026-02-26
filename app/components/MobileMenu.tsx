'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  className?: string;
}

export default function MobileMenu({ className }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`md:hidden flex items-center ${className || ''}`}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMenuOpen && (
        <div className="absolute top-14 right-0 bg-white shadow-md p-4 w-48 rounded-lg z-10 animate-in fade-in slide-in-from-top-2 duration-200">
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
