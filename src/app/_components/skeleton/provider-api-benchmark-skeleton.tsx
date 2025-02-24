import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function ProviderApiBenchmarkSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Card className="p-6">
        <div className="space-y-8">
          {/* Table skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
          {/* Charts skeleton */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        </div>
      </Card>
    </div>
  );
}
