'use server';
import { cookies } from 'next/headers';

import { createSecretSessionClient } from '@/lib/appwrite';

interface Result {
  success?: boolean;
  error?: string;
}

export default async function completeOAuthServer(secret: string): Promise<Result> {
  if (!secret) return { error: 'Missing session secret' };
  try {
    const { account } = await createSecretSessionClient(secret);
    const { jwt } = await account.createJWT();
    (await cookies()).set('appwrite-session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return { success: true };
  } catch (error) {
    console.log('OAuth completion failed', error);
    return { error: 'OAuth completion failed' };
  }
}
