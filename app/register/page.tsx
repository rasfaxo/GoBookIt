'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';

import createUser from '@/services/auth/createUser';
import { Input, Button } from '@/components';
import { STRINGS } from '@/constants/strings';

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
          <h1 className="text-3xl font-extrabold text-center text-blue-700 tracking-tight">{STRINGS.auth.registerTitle}</h1>
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

          <Input type="text" id="name" name="name" label="Name" autoComplete="name" required placeholder="Full name" />
          <Input type="email" id="email" name="email" label={STRINGS.auth.email} autoComplete="email" required placeholder="you@mail.com" />
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-semibold text-blue-700">
              {STRINGS.auth.password}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete="new-password"
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
          <div className="space-y-1">
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-blue-700">
              {STRINGS.auth.confirmPassword}
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                id="confirm-password"
                name="confirm-password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute inset-y-0 right-2 flex items-center text-xs text-blue-600 hover:text-blue-700"
                aria-label={showConfirm ? STRINGS.auth.hide + ' confirm password' : STRINGS.auth.show + ' confirm password'}
              >
                {showConfirm ? STRINGS.auth.hide : STRINGS.auth.show}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full">
              {isSubmitting ? 'Processing…' : STRINGS.auth.registerTitle}
            </Button>
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
