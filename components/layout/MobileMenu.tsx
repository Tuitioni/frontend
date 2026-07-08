'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  className?: string;
}

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Find Tutors', path: '/tutors' },
  { name: 'Post a Request', path: '/post-tuition' },
  { name: 'Teaching Jobs', path: '/jobs' },
  { name: 'How we work', path: '/aboutUs' },
];

export default function MobileMenu({ className }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  // Auth state lives in a client-only cookie; render the logged-out state
  // until mounted so SSR and the first client render match (no hydration
  // mismatch), same pattern as AuthButtons.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the panel on navigation.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const authed = mounted && isAuthenticated;

  return (
    <div className={`md:hidden flex items-center ${className || ''}`}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMenuOpen && (
        <div className="absolute top-14 right-0 bg-popover border border-border shadow-soft-lg p-4 w-56 rounded-xl z-10 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="mb-3 flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-2 border-t border-border pt-3">
            {authed ? (
              <>
                <Link href="/dashboard">
                  <Button variant="default" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="default" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
