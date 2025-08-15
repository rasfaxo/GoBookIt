'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';

import createUser from '@/services/auth/createUser';

interface RegisterState {
  error?: string;
  success?: boolean;
}

const RegisterPage = () => {
  const action = createUser as unknown as (
    prev: RegisterState,
    form: FormData
  ) => Promise<RegisterState>;
  const [state, formAction] = useActionState<RegisterState, FormData>(action, {});
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const isSubmitting = state && !state.error && !state.success && Object.keys(state).length > 0;

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success('You can now log in!');
      router.push('/login');
    }
  }, [state, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-300 px-4 py-10">
      <div className="relative bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-200">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white py-1 px-4 rounded-full text-sm shadow">
          Create Account
        </div>
        <form
          action={async (formData) => {
            const pwd = formData.get('password') as string;
            const cpwd = formData.get('confirm-password') as string;
            if (pwd !== cpwd) {
              setClientError('Passwords do not match');
              return;
            }
            setClientError(null);
            return formAction(formData);
          }}
          className="space-y-6"
          noValidate
        >
          <h1 className="text-3xl font-extrabold text-center text-blue-700 tracking-tight">Register</h1>
          <p className="text-center text-sm text-blue-500">Sign up to start booking and managing rooms</p>

          {clientError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium border border-red-200" role="alert">
              {clientError}
            </div>
          )}
          {state?.error && !clientError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-medium border border-red-200" role="alert">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm font-medium border border-green-200" role="status">
              Registration successful — redirecting ...
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-semibold text-blue-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-blue-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-300 shadow-sm"
              autoComplete="name"
              required
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-semibold text-blue-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-blue-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-300 shadow-sm"
              autoComplete="email"
              required
              placeholder="you@mail.com"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-semibold text-blue-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="border border-blue-300 rounded-lg w-full py-2 px-3 pr-11 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-300 shadow-sm"
                required
                autoComplete="new-password"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-2 flex items-center text-xs text-blue-600 hover:text-blue-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-blue-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirm-password"
                name="confirm-password"
                className="border border-blue-300 rounded-lg w-full py-2 px-3 pr-11 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-300 shadow-sm"
                autoComplete="new-password"
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute inset-y-0 right-2 flex items-center text-xs text-blue-600 hover:text-blue-700"
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg w-full shadow hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? 'Processing…' : 'Register'}
            </button>
            <div className="text-center text-sm text-blue-600">
              <span className="mr-1">Already have an account?</span>
              <Link href="/login" className="font-semibold underline-offset-2 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
