import { Skeleton } from '@/components';

export default function AddRoomLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
