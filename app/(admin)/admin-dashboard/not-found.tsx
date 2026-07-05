'use client';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-4">
      <div className="mx-4 w-full max-w-lg space-y-6 rounded-2xl border border-border bg-card p-8 text-center shadow-float">
        <div className="relative">
          <h1 className="font-display text-9xl font-extrabold text-muted tabular">404</h1>
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-semibold text-gradient">
            Oops!
          </p>
        </div>

        <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>

        <p className="text-muted-foreground">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>

        <div className="flex justify-center gap-3">
          <a
            href="/admin-dashboard"
            className="rounded-pill bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
          >
            Go to Dashboard
          </a>
          <button
            onClick={() => window.history.back()}
            className="rounded-pill border border-border px-6 py-3 font-semibold transition-colors hover:bg-muted"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
