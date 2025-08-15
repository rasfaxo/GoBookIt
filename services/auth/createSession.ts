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

  const admin = createAdminClient();

  try {
    const session = await admin.account.createEmailPasswordSession(email, password);

    if (session && (session as any).secret) {
      const secret = String((session as any).secret || '');
      const dotCount = (secret.match(/\./g) || []).length;
      if (dotCount === 2) {
        try {
          const { account: sessionAccount } = await createSecretSessionClient(secret);
          const { jwt } = await sessionAccount.createJWT();
          (await cookies()).set('appwrite-session', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
          });
          return { success: true };
        } catch (err) {
          console.log('Failed to mint JWT using session secret (invalid format?)', err, {
            session,
          });
        }
      } else {
        console.log('Session secret does not look like a JWT, skipping session-secret path', {
          secretPreviewLength: secret.length,
        });
      }
    }
    try {
      const userId =
        (session as any).userId || (session as any)['userId'] || (session as any)['user_id'];
      const sessionId = (session as any).$id || (session as any).id || (session as any).sessionId;
      if (!userId || !sessionId) {
        console.log('Session returned without userId or sessionId', session);
        return { error: 'Unable to mint JWT: missing user/session id' };
      }
      const { jwt } = await admin.users.createJWT(userId, sessionId as string);
      (await cookies()).set('appwrite-session', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      return { success: true };
    } catch (err) {
      console.log('Failed to mint JWT using admin.users.createJWT', err, { session });
      return { error: err instanceof Error ? err.message : 'Failed to mint JWT' };
    }
  } catch (err) {
    console.log('Failed to create email/password session', err);
    return { error: 'Invalid Credentials' };
  }
}
