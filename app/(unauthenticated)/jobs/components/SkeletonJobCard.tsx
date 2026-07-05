export default function SkeletonJobCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 w-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-6 w-16 animate-pulse rounded-pill bg-muted" />
      </div>

      <div className="mt-2 h-4 w-full animate-pulse rounded-xl bg-muted" />

      <div className="mt-4 space-y-2">
        <div className="h-4 w-1/2 animate-pulse rounded-xl bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded-xl bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded-xl bg-muted" />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
        <div className="h-6 w-16 animate-pulse rounded-pill bg-muted" />
        <div className="h-6 w-20 animate-pulse rounded-pill bg-muted" />
      </div>
    </div>
  );
}
