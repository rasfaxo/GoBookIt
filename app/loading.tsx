import { Skeleton } from '@/components';

export default function RootLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-blue-100 bg-white/80 p-4">
          <Skeleton className="mb-3 h-40 w-full rounded-lg" />
          <Skeleton className="mb-2 h-5 w-2/3" />
          <Skeleton className="mb-1 h-3 w-full" />
          <Skeleton className="mb-1 h-3 w-5/6" />
          <Skeleton className="mt-4 h-8 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}
