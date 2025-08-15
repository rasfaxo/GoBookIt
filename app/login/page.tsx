'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '@/lib/context/authContext';
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

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success('Signed in successfully');
      setIsAuthenticated(true);
      router.push('/');
    }
  }, [state, router, setIsAuthenticated]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm mt-20">
        <form action={formAction}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border rounded w-full py-2 px-3"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border rounded w-full py-2 px-3"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex flex-col gap-5">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
          <button
            type="button"
            className="bg-transparent text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white mt-4 w-full"
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
          <div className="mt-6 flex items-center gap-2">
            <span className="account-question">Don't have an account?</span>
            <Link href="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
