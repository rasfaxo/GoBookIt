'use server';
import { cookies } from 'next/headers';

import { createAdminClient, createSecretSessionClient } from '@/lib/appwrite';

interface ActionResult {
  success?: boolean;
  error?: string;
}

export default async function createSession(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;

  if (!email || !password) return { error: 'Please fill out all fields' };

  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);
    const { account: sessionAccount } = await createSecretSessionClient(session.secret);
    try {
      const { jwt } = await sessionAccount.createJWT();
      (await cookies()).set('appwrite-session', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      return { success: true };
    } catch {
      return { error: 'Failed to mint JWT' };
    }
  } catch {
    return { error: 'Invalid Credentials' };
  }
}
