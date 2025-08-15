'use server';
import { ID } from 'node-appwrite';

import { createAdminClient } from '@/lib/appwrite';

interface ActionResult {
  success?: boolean;
  error?: string;
}

export default async function createUser(
  _prev: unknown,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get('name') as string | null;
  const email = formData.get('email') as string | null;
  const password = formData.get('password') as string | null;
  const confirmPassword = formData.get('confirm-password') as string | null;

  if (!email || !name || !password) return { error: 'Please fill in all fields' };
  if (password.length < 8) return { error: 'Password must be at least 8 characters long' };
  if (password !== confirmPassword) return { error: 'Passwords do not match' };

  const { account } = await createAdminClient();
  try {
    await account.create(ID.unique(), email, password, name);
    return { success: true };
  } catch {
    return { error: 'Could not register user' };
  }
}
