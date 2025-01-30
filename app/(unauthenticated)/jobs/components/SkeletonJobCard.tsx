import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonJobCard() {
  return (
    <div className="p-3 border rounded-md shadow-md">
      <div className="mb-2">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
