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

import { ThemeToggle } from '@/components/layout/ThemeToggle';
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

  const Brand = () => (
    <Link href="/admin-dashboard" className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 font-display text-base font-extrabold text-white shadow-glow">
        T
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-bold text-foreground">Tuitioni</span>
        <span className="block text-xs font-medium text-muted-foreground">Admin panel</span>
      </span>
    </Link>
  );

  const NavContent = () => (
    <nav aria-label="Admin navigation" className="p-3">
      <ul className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-all',
                isActive(href)
                  ? 'bg-primary text-primary-foreground shadow-soft-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  const LogoutButton = () => (
    <div className="mt-auto flex items-center gap-2 border-t border-border p-3">
      <button
        onClick={handleLogout}
        className="flex flex-1 items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-error/10 hover:text-error"
      >
        <LogOut size={18} />
        Logout
      </button>
      <ThemeToggle />
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden min-h-screen w-64 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-5">
          <Brand />
        </div>
        <NavContent />
        <div className="flex-1" />
        <LogoutButton />
      </aside>

      {/* Mobile top bar + sheet sidebar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-3 shadow-soft-sm md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open navigation menu"
              className="rounded-md p-1 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-border bg-card p-0">
            <SheetTitle className="border-b border-border p-5">
              <Brand />
            </SheetTitle>
            <NavContent />
            <LogoutButton />
          </SheetContent>
        </Sheet>
        <Brand />
        <ThemeToggle className="ml-auto" />
      </div>
    </>
  );
}
