'use server';
import { cookies } from 'next/headers';

import { createSessionClient, createAdminClient } from '@/lib/appwrite';

interface ActionResult {
  success?: boolean;
  error?: string;
}

export default async function destroySession(): Promise<ActionResult> {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) return { error: 'No session cookie found' };

  try {
    const { account } = await createSessionClient(sessionCookie.value);
    const me = await account.get();
    const { users } = await createAdminClient();
    await users.deleteSessions(me.$id);
    (await cookies()).delete('appwrite-session');
    return { success: true };
  } catch {
    (await cookies()).delete('appwrite-session');
    return { error: 'Error deleting session' };
  }
}
