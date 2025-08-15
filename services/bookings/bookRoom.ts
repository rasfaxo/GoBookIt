'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ID } from 'node-appwrite';

import checkAuth from '../auth/checkAuth';
import checkRoomAvailability from '../rooms/checkRoomAvailability';

import type { BookingDoc } from '@/types/bookings';

import { createSessionClient } from '@/lib/appwrite';
import { parseBookRoomForm } from '@/utils/validation';

interface ActionResult {
  success?: boolean;
  error?: string;
  data?: BookingDoc;
}

export default async function bookRoom(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) redirect('/login');
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { user } = await checkAuth();
    if (!user) return { error: 'You must be logged in to book a room' };

    const parsed = parseBookRoomForm(formData);
    if ('error' in parsed) return { error: parsed.error };
    const { room_id, check_in, check_out } = parsed;

    const isAvailable = await checkRoomAvailability(room_id, check_in, check_out);
    if (!isAvailable) return { error: 'This room is already booked for the selected time' };

    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!,
      ID.unique(),
      {
        check_in,
        check_out,
        user_id: user.id,
        room_id: room_id,
      }
    );
    revalidatePath('/bookings', 'layout');
    return { success: true, data: document as unknown as BookingDoc };
  } catch (error) {
    console.log('Failed to book room', error);
    return { error: 'Something went wrong booking the room' };
  }
}
