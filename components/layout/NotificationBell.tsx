'use client';

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useToken } from '@/hooks/useToken';

interface Notification {
  id: string;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { makeAuthenticatedRequest, isAuthenticated } = useAuth();
  const decoded = useToken();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const show = mounted && isAuthenticated && decoded?.role !== 'admin';
  const unread = items.filter((n) => !n.read).length;

  const load = useCallback(async () => {
    try {
      const data = await makeAuthenticatedRequest('/api/notification');
      setItems(Array.isArray(data) ? data : []);
    } catch {
      /* stay silent - the bell should not error the whole nav */
    }
  }, [makeAuthenticatedRequest]);

  // Poll for the badge while signed in.
  useEffect(() => {
    if (!show) return;
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [show, load]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!show) return null;

  const openNotification = async (n: Notification) => {
    setOpen(false);
    if (!n.read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      makeAuthenticatedRequest(`/api/notification/${n.id}/read`, { method: 'PATCH' }).catch(
        () => {}
      );
    }
    if (n.link) router.push(n.link);
  };

  const markAllRead = async () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    makeAuthenticatedRequest('/api/notification/read-all', { method: 'PATCH' }).catch(() => {});
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) load();
        }}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber px-1 text-[10px] font-bold tabular text-[#3A2A05]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-soft-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="font-display text-sm font-bold">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openNotification(n)}
                  className={`flex w-full flex-col gap-0.5 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted ${
                    n.read ? '' : 'bg-primary/[0.04]'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-amber" />}
                    {n.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{n.message}</span>
                  <span className="text-[11px] text-muted-foreground/70 tabular">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
