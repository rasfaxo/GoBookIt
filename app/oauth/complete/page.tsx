'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '@/lib/context/authContext';

// NOTE: Using client-side OAuth completion
import completeOAuthClient from '@/services/auth/completeOAuth';

function OAuthCompleteInner() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const search = useSearchParams();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    (async () => {
      try {
        // Appwrite adds 'secret' query param for OAuth completion
        // Legacy helper handles exchange + POST to internal API
        await completeOAuthClient();
        await refreshAuth();
        toast.success('Signed in successfully', { toastId: 'google-login' });
        router.replace('/');
      } catch {
        toast.error('Failed to sign in', { toastId: 'google-login' });
        router.replace('/login');
      }
    })();
  }, [refreshAuth, router, search]);

  return <p>Finishing sign-in…</p>;
}

export default function OAuthCompletePage() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Suspense fallback={<p>Finishing sign-in…</p>}>
        <OAuthCompleteInner />
      </Suspense>
    </div>
  );
}
