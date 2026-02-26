'use client';

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Wallet,
  LineChart,
  Settings,
  LogOut,
  Bell,
  Briefcase,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin-dashboard/teacher', label: 'Teachers', icon: Users },
  { href: '/admin-dashboard/student', label: 'Students', icon: GraduationCap },
  { href: '/admin-dashboard/job', label: 'Jobs', icon: Briefcase },
  { href: '/admin-dashboard/tuition', label: 'Tuitions', icon: BookOpen },
  { href: '/admin-dashboard/payment', label: 'Payments', icon: Wallet },
  { href: '/admin-dashboard/announcement', label: 'Announcements', icon: Bell },
  { href: '/admin-dashboard/report', label: 'Reports', icon: LineChart },
  { href: '/admin-dashboard/setting', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  const isActive = (href: string) => {
    if (href === '/admin-dashboard') return pathname === href;
    return pathname?.startsWith(href) ?? false;
  };

  const NavContent = () => (
    <nav aria-label="Admin navigation" className="p-4">
      <ul className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all',
                isActive(href)
                  ? 'bg-gray-700/70 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  const LogoutButton = () => (
    <div className="p-4 mt-auto">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all w-full"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 w-64 min-h-screen shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        <NavContent />
        <div className="flex-1" />
        <LogoutButton />
      </aside>

      {/* Mobile top bar + sheet sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 px-4 py-3 flex items-center shadow-lg">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open navigation menu"
              className="text-white p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 border-gray-700"
          >
            <SheetTitle className="p-6 border-b border-gray-700 text-xl font-bold text-white">
              Admin Panel
            </SheetTitle>
            <NavContent />
            <LogoutButton />
          </SheetContent>
        </Sheet>
        <span className="text-white font-bold ml-3">Admin Panel</span>
      </div>
    </>
  );
}
