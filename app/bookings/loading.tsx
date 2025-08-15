import { Skeleton } from '@/components';

export default function BookingsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-blue-100 bg-white/80 p-4 space-y-3">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
