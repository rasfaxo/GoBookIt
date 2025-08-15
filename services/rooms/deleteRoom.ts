'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';

import { createSessionClient } from '@/lib/appwrite';

interface ActionResult {
  success?: boolean;
  error?: string;
}

export default async function deleteRoom(roomId: string): Promise<ActionResult> {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) redirect('/login');
  try {
    const { account, databases } = await createSessionClient(sessionCookie.value);
    const user = await account.get();
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!,
      [Query.equal('user_id', user.$id)]
    );
    const roomToDelete = rooms.find((r: { $id: string }) => r.$id === roomId);
    if (!roomToDelete) return { error: 'Room not found' };
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!,
      roomToDelete.$id
    );
    revalidatePath('/rooms/my', 'layout');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.log('Failed to delete room', error);
    return { error: 'Failed to delete room' };
  }
}
