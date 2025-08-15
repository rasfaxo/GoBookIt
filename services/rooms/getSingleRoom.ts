'use server';
import type { RoomDoc } from '@/types/rooms';
import { type ApiResult } from '../apiClient';

import { createAdminClient } from '@/lib/appwrite';
import { asRoomDoc } from '@/utils/validation';

export default async function getSingleRoom(roomId: string): Promise<ApiResult<RoomDoc>> {
  try {
    const { databases } = await createAdminClient();
    const room = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS!,
      roomId
    );
    return { ok: true, data: asRoomDoc(room) as RoomDoc };
  } catch (error) {
    console.log('Failed to get room', error);
    return { ok: false, error: 'Failed to load room' };
  }
}
