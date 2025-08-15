import { Skeleton } from '@/components';

export default function MyRoomsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-blue-100 bg-white/80 p-4 flex flex-col gap-3">
          <Skeleton className="h-5 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
