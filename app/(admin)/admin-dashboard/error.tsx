'use client';

import Link from 'next/link';

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-4">
      <div className="mx-4 w-full max-w-lg space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-float">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
        <p className="text-muted-foreground">
          An error occurred in the admin dashboard. Please try again.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-pill bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/admin-dashboard"
            className="rounded-pill border border-border px-6 py-3 font-semibold transition-colors hover:bg-muted"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
