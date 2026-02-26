'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function AuthButtons() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="hidden md:flex gap-2">
      {isAuthenticated ? (
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
