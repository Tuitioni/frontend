'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

interface Application {
  id: string;
  status: string;
  expected_salary: number;
  post?: {
    firstName?: string;
    lastName?: string;
    subjects?: string[];
    class?: string;
  } | null;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-warning/10 text-warning',
  ACTIVE: 'bg-success/10 text-success',
  COMPLETED: 'bg-primary/10 text-primary',
  CANCELLED: 'bg-muted text-muted-foreground',
};

export function TeacherApplications({ teacherId }: { teacherId?: string }) {
  const { makeAuthenticatedRequest } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!teacherId) return;
    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest(`/api/job/teacher/${teacherId}`);
      setApps(Array.isArray(data) ? data : []);
    } catch {
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, [teacherId, makeAuthenticatedRequest]);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      load();
    }
  }, [load]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">My applications</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : apps.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            You haven&apos;t applied to any tuition posts yet. Browse teaching jobs to apply.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {apps.map((a) => {
              const title =
                (a.post?.subjects ?? []).join(', ') ||
                `${a.post?.firstName ?? ''} ${a.post?.lastName ?? ''}`.trim() ||
                'Tuition post';
              return (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {title}
                      {a.post?.class ? ` · ${a.post.class}` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground tabular">
                      You asked ৳{a.expected_salary?.toLocaleString?.() ?? a.expected_salary}/mo
                    </p>
                  </div>
                  <span
                    className={`rounded-pill px-2.5 py-1 text-xs font-semibold ${
                      STATUS_STYLES[a.status] ?? 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {a.status === 'ACTIVE' ? 'ACCEPTED' : a.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
