'use client';

import { AlertCircle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useToken } from '@/hooks/useToken';

interface Applicant {
  id: string;
  status: string;
  expected_salary: number;
  teacher?: { firstName?: string; lastName?: string } | null;
}

interface StudentPost {
  id: string;
  subjects: string[];
  class: string;
  salary: number;
  numberOfDays: number;
  createdAt: string;
  jobs?: Applicant[];
}

interface HireItem {
  id: string;
  status: string;
  createdAt: string;
  teacher?: { firstName?: string; lastName?: string } | null;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-warning/10 text-warning',
  ACTIVE: 'bg-success/10 text-success',
  APPROVED: 'bg-success/10 text-success',
  COMPLETED: 'bg-primary/10 text-primary',
  REJECTED: 'bg-error/10 text-error',
  CANCELLED: 'bg-muted text-muted-foreground',
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`rounded-pill px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground'
      }`}
    >
      {status}
    </span>
  );
}

export default function StudentDashboardPage() {
  const { makeAuthenticatedRequest, logout } = useAuth();
  const { toast } = useToast();
  const decodedToken = useToken();
  const router = useRouter();

  const [posts, setPosts] = useState<StudentPost[]>([]);
  const [hires, setHires] = useState<HireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!decodedToken?.sub) {
      setError('Authentication error - no user ID found');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [postsData, hiresData] = await Promise.all([
        makeAuthenticatedRequest(`/api/post/student/${decodedToken.sub}`),
        makeAuthenticatedRequest(`/api/hire/student/${decodedToken.sub}`),
      ]);
      setPosts(Array.isArray(postsData) ? postsData : []);
      setHires(Array.isArray(hiresData) ? hiresData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your dashboard');
    } finally {
      setLoading(false);
    }
  }, [decodedToken?.sub, makeAuthenticatedRequest]);

  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      load();
    }
  }, [load]);

  const acceptApplicant = async (jobId: string) => {
    setAcceptingId(jobId);
    try {
      await makeAuthenticatedRequest(`/api/job/${jobId}/accept`, { method: 'PATCH' });
      toast({
        title: 'Tutor accepted',
        description: 'A tuition has been created. Other applicants were declined.',
      });
      await load();
    } catch (err) {
      toast({
        title: 'Could not accept',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">My Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review applicants on your requests and find new tutors.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            className="flex-1 rounded-pill font-semibold shadow-glow sm:flex-initial"
            onClick={() => router.push('/post-tuition')}
          >
            + Post a request
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-pill font-semibold sm:flex-initial"
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

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Posts + applicants */}
      <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-soft-sm sm:p-6">
        <h2 className="mb-4 font-display text-lg font-bold">My tuition requests</h2>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-10 text-center">
            <p className="font-semibold">No requests yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Post a tuition request and verified tutors will apply.
            </p>
            <Button
              onClick={() => router.push('/post-tuition')}
              className="mt-4 rounded-pill font-semibold shadow-glow"
            >
              Post a request
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const applicants = post.jobs ?? [];
              const filled = applicants.some((a) => a.status === 'ACTIVE');
              return (
                <div key={post.id} className="rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">
                        {(post.subjects ?? []).join(', ') || 'Tuition request'}
                        {post.class ? ` · ${post.class}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground tabular">
                        ৳{post.salary?.toLocaleString?.() ?? post.salary}/mo · {post.numberOfDays}{' '}
                        days/week
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {applicants.length} applicant{applicants.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {applicants.length > 0 && (
                    <ul className="mt-3 divide-y divide-border border-t border-border">
                      {applicants.map((a) => {
                        const name = a.teacher
                          ? `${a.teacher.firstName ?? ''} ${a.teacher.lastName ?? ''}`.trim()
                          : 'Tutor';
                        return (
                          <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                            <div>
                              <p className="text-sm font-semibold">{name}</p>
                              <p className="text-xs text-muted-foreground tabular">
                                Asking ৳{a.expected_salary?.toLocaleString?.() ?? a.expected_salary}
                                /mo
                              </p>
                            </div>
                            {a.status === 'PENDING' && !filled ? (
                              <Button
                                size="sm"
                                className="rounded-pill"
                                disabled={acceptingId === a.id}
                                onClick={() => acceptApplicant(a.id)}
                              >
                                {acceptingId === a.id ? 'Accepting…' : 'Accept'}
                              </Button>
                            ) : (
                              <StatusPill status={a.status} />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Direct hires */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm sm:p-6">
        <h2 className="mb-4 font-display text-lg font-bold">My hire requests</h2>
        {loading ? (
          <Skeleton className="h-16 w-full rounded-xl" />
        ) : hires.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            You haven&apos;t sent any direct hire requests. Browse{' '}
            <button
              className="font-semibold text-primary hover:underline"
              onClick={() => router.push('/tutors')}
            >
              tutors
            </button>{' '}
            to hire one directly.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {hires.map((hire) => {
              const name = hire.teacher
                ? `${hire.teacher.firstName ?? ''} ${hire.teacher.lastName ?? ''}`.trim()
                : 'Tutor';
              return (
                <li key={hire.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground tabular">
                      Requested {new Date(hire.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusPill status={hire.status ?? 'PENDING'} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
