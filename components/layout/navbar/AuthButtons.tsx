'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function AuthButtons() {
  const { isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Auth state comes from a client-only cookie, so it is unknown during SSR.
  // Render the logged-out state until mounted so the first client render
  // matches the server and avoids a hydration mismatch.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="hidden md:flex gap-2">
      {mounted && isAuthenticated ? (
        <>
          <Link href="/dashboard">
            <Button variant="default" className="px-4 py-2 bg-transparent">
              Dashboard
            </Button>
          </Link>
          <Button variant="default" className="px-4 py-2 bg-transparent" onClick={logout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="default" className="px-4 py-2">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="default" className="px-4 py-2">
              Register
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
