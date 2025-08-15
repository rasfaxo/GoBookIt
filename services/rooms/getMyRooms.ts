'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';

import type { RoomDoc } from '@/types/rooms';

import { createSessionClient } from '@/lib/appwrite';
import { asRoomDoc } from '@/utils/validation';

export default async function getMyRooms(): Promise<RoomDoc[]> {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) redirect('/login');
  try {
    const { account, databases } = await createSessionClient(sessionCookie!.value);
    const user = await account.get();
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!,
      [Query.equal('user_id', user.$id)]
    );
    return rooms
      .map((r) => {
        try {
          return asRoomDoc(r) as RoomDoc;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as RoomDoc[];
  } catch (error) {
    console.log('Failed to get user rooms', error);
    throw new Error('Failed to load user rooms');
  }
}
