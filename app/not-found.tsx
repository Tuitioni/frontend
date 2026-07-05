import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh px-4">
      <div className="mx-4 w-full max-w-lg space-y-6 p-8 text-center">
        <h1 className="font-display text-9xl font-extrabold text-gradient">404</h1>
        <h2 className="text-3xl font-bold">Page not found</h2>
        <p className="text-muted-foreground">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-block rounded-pill bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
