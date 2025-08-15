'use server';
import type { RoomDoc } from '@/types/rooms';

import { createAdminClient } from '@/lib/appwrite';
// no redirect here; handled by error boundary
import { asRoomDoc } from '@/utils/validation';

export default async function getAllRooms(): Promise<RoomDoc[]> {
  try {
    const { databases } = await createAdminClient();
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!
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
    console.log('Failed to get rooms', error);
    throw new Error('Failed to load rooms');
  }
}
