'use server';
import type { RoomDoc } from '@/types/rooms';
import { type ApiResult } from '../apiClient';

import { createAdminClient } from '@/lib/appwrite';
// no redirect here; handled by error boundary
import { asRoomDoc } from '@/utils/validation';

export default async function getAllRooms(): Promise<ApiResult<RoomDoc[]>> {
  try {
    const { databases } = await createAdminClient();
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!
    );
    const mapped = rooms
      .map((r) => {
        try {
          return asRoomDoc(r) as RoomDoc;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as RoomDoc[];
    return { ok: true, data: mapped };
  } catch (error) {
    console.log('Failed to get rooms', error);
    return { ok: false, error: 'Failed to load rooms' };
  }
}
