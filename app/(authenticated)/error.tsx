'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-soft-lg">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-extrabold sm:text-3xl">
          Something went wrong
        </h2>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()} className="rounded-pill px-6 font-semibold shadow-glow">
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-pill px-6 font-semibold">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
