'use client';

import { AlertCircle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToken } from '@/hooks/useToken';

interface HireItem {
  id: string;
  status: string;
  createdAt: string;
  teacher?: { firstName?: string; lastName?: string } | null;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-warning/10 text-warning',
  APPROVED: 'bg-success/10 text-success',
  REJECTED: 'bg-error/10 text-error',
  CANCELLED: 'bg-muted text-muted-foreground',
};

export default function StudentDashboardPage() {
  const { makeAuthenticatedRequest, logout } = useAuth();
  const decodedToken = useToken();
  const router = useRouter();
  const [hires, setHires] = useState<HireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHires = useCallback(async () => {
    if (!decodedToken?.sub) {
      setError('Authentication error - no user ID found');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest(`/api/hire/student/${decodedToken.sub}`);
      setHires(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your hires');
    } finally {
      setLoading(false);
    }
  }, [decodedToken?.sub, makeAuthenticatedRequest]);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchHires();
    }
  }, [fetchHires]);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">My Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your tutor requests and find new tutors.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            className="flex-1 rounded-pill font-semibold shadow-glow sm:flex-initial"
            onClick={() => router.push('/tutors')}
          >
            <Search className="mr-2 h-4 w-4" />
            Find a tutor
          </Button>
          <Button
            variant="outline"
            onClick={logout}
            className="flex-1 rounded-pill font-semibold text-muted-foreground hover:border-error/40 hover:bg-error/10 hover:text-error sm:flex-initial"
          >
            Logout
          </Button>
          <ThemeToggle className="hidden sm:inline-grid" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm sm:p-6">
        <h2 className="mb-4 font-display text-lg font-bold">My hire requests</h2>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        ) : hires.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-10 text-center">
            <p className="font-semibold">No hire requests yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse tutors and send your first hire request.
            </p>
            <Button
              onClick={() => router.push('/tutors')}
              className="mt-4 rounded-pill font-semibold shadow-glow"
            >
              Browse tutors
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {hires.map((hire) => {
              const name = hire.teacher
                ? `${hire.teacher.firstName ?? ''} ${hire.teacher.lastName ?? ''}`.trim()
                : 'Tutor';
              const status = hire.status ?? 'PENDING';
              return (
                <li key={hire.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground tabular">
                      Requested {new Date(hire.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-pill px-2.5 py-1 text-xs font-semibold ${
                      STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
