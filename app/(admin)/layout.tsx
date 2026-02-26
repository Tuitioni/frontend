'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import Sidebar from '@/components/ui/admin/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && !pathname?.includes('/signin')) {
      router.replace('/signin');
    }
  }, [isAuthenticated, pathname, router]);

  // Don't show admin layout on signin page
  if (pathname?.includes('/signin')) {
    return <>{children}</>;
  }

  // Don't show anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-y-auto bg-gray-50 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
