'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '@/lib/context/authContext';
import { Input, Button, Card } from '@/components';
import { STRINGS } from '@/constants/strings';
import createSession from '@/services/auth/createSession';

interface ActionState {
  error?: string;
  success?: boolean;
}

const LoginPage = () => {
  const action = createSession as unknown as (
    prev: ActionState,
    form: FormData
  ) => Promise<ActionState>;
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const isSubmitting = state && !state.error && !state.success && Object.keys(state).length > 0;

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success('Signed in successfully');
      setIsAuthenticated(true);
      router.push('/');
    }
  }, [state, router, setIsAuthenticated]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 px-4 py-10">
      <div className="relative bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-200">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white py-1 px-4 rounded-full text-sm shadow">
          Welcome Back
        </div>
        <form action={formAction} className="space-y-6" noValidate>
          <h1 className="text-3xl font-extrabold text-center text-blue-700 tracking-tight">{STRINGS.auth.loginTitle}</h1>
          <p className="text-center text-sm text-blue-500">Sign in to manage your bookings and rooms</p>

          {state?.error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium border border-red-200" role="alert">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm font-medium border border-green-200" role="status">
              Login successful — redirecting ...
            </div>
          )}

          <Input
            type="email"
            name="email"
            label={STRINGS.auth.email}
            autoComplete="email"
            required
            placeholder="you@mail.com"
          />

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-semibold text-blue-700">
              {STRINGS.auth.password}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-2 flex items-center text-xs text-blue-600 hover:text-blue-700"
                aria-label={showPassword ? STRINGS.auth.hide + ' password' : STRINGS.auth.show + ' password'}
              >
                {showPassword ? STRINGS.auth.hide : STRINGS.auth.show}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full">
              {isSubmitting ? 'Processing…' : STRINGS.auth.loginTitle}
            </Button>
            <button
              type="button"
              className="bg-white text-blue-600 border border-blue-500 font-medium py-2.5 px-4 rounded-lg w-full shadow-sm hover:bg-blue-50 transition-colors"
              onClick={() => {
                const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
                const origin = window.location.origin;
                const endpoint = (
                  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1'
                ).replace(/\/$/, '');
                const successUrl =
                  process.env.NEXT_PUBLIC_APPWRITE_OAUTH_SUCCESS_URL || `${origin}/oauth/complete`;
                const failureUrl =
                  process.env.NEXT_PUBLIC_APPWRITE_OAUTH_FAILURE_URL || `${origin}/login`;
                window.location.href = `${endpoint}/account/sessions/oauth2/google?project=${projectId}&success=${encodeURIComponent(
                  successUrl
                )}&failure=${encodeURIComponent(failureUrl)}`;
              }}
            >
              Login with Google
            </button>
            <div className="text-center text-sm text-blue-600">
              <span className="mr-1">{STRINGS.auth.dontHaveAccount}</span>
              <Link href="/register" className="font-semibold underline-offset-2 hover:underline">
                {STRINGS.auth.signUp}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
