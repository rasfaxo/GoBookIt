'use server';
import { cookies } from 'next/headers';

import type { AuthUser, CheckAuthResult } from '@/types/auth';

import { createSessionClient } from '@/lib/appwrite';

async function checkAuth(): Promise<CheckAuthResult> {
  const sessionCookie = (await cookies()).get('appwrite-session');

  if (!sessionCookie) {
    return { isAuthenticated: false };
  }

  try {
    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();
    return {
      isAuthenticated: true,
      user: {
        id: user.$id,
        name: user.name,
        email: user.email,
      },
    };
  } catch {
    return { isAuthenticated: false };
  }
}

export default checkAuth;
