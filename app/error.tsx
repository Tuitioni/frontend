'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-4">
      <div className="mx-4 w-full max-w-lg space-y-6 p-8 text-center">
        <h2 className="text-3xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
        <button
          onClick={() => reset()}
          className="rounded-pill bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
