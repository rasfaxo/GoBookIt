'use server';
import type { RoomDoc } from '@/types/rooms';

import { createAdminClient } from '@/lib/appwrite';
import { asRoomDoc } from '@/utils/validation';

export default async function getSingleRoom(roomId: string): Promise<RoomDoc> {
  try {
    const { databases } = await createAdminClient();
    const room = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!,
      roomId
    );
    return asRoomDoc(room) as RoomDoc;
  } catch (error) {
    console.log('Failed to get room', error);
    throw new Error('Failed to load room');
  }
}
