export default function SkeletonTutorCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded-xl bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
        <div className="h-6 w-16 animate-pulse rounded-pill bg-muted" />
      </div>

      <div className="mt-4 h-4 w-3/4 animate-pulse rounded-xl bg-muted" />

      <div className="mt-3 flex flex-wrap gap-1.5">
        <div className="h-6 w-16 animate-pulse rounded-pill bg-muted" />
        <div className="h-6 w-20 animate-pulse rounded-pill bg-muted" />
        <div className="h-6 w-14 animate-pulse rounded-pill bg-muted" />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="h-3 w-20 animate-pulse rounded-xl bg-muted" />
        <div className="h-8 w-20 animate-pulse rounded-pill bg-muted" />
      </div>
    </div>
  );
}
