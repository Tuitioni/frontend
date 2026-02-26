'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 p-8 max-w-lg w-full mx-4">
        <h2 className="text-3xl font-bold text-gray-800">Something went wrong</h2>
        <p className="text-gray-600">An unexpected error occurred. Please try again.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-blue text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
