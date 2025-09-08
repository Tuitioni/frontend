import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTutorCard() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-32" /> {/* Name */}
            <Skeleton className="h-4 w-16" /> {/* Experience */}
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-3/4" /> {/* Education */}
            <Skeleton className="h-4 w-1/2" /> {/* Location */}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="h-9 w-full mt-2" /> {/* Button */}
        </div>
      </CardContent>
    </Card>
  );
}
