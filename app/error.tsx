'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Heading from '@/components/ui/Heading';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error('App error boundary:', error);
  }, [error]);
  return (
    <div className="p-8">
      <Heading title="Something went wrong" />
      <p className="mt-4 text-gray-600">
        An unexpected error occurred. You can go back to the homepage.
      </p>
      <div className="mt-6 flex gap-4">
        <button onClick={() => reset()} className="bg-blue-500 text-white px-4 py-2 rounded">
          Try Again
        </button>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
