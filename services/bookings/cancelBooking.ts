'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import checkAuth from '../auth/checkAuth';

import type { BookingDoc } from '@/types/bookings';

import { createSessionClient } from '@/lib/appwrite';

interface ActionResult {
  success?: boolean;
  error?: string;
  data?: BookingDoc;
}

export default async function cancelBooking(bookingId: string): Promise<ActionResult> {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) redirect('/login');
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { user } = await checkAuth();
    if (!user) return { error: 'You must be logged in to cancel a booking' };
    const booking = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!,
      bookingId
    );
    if (booking.user_id !== user.id)
      return { error: 'You are not authorized to cancel this booking' };
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!,
      bookingId
    );
    revalidatePath('/bookings', 'layout');
    return { success: true };
  } catch (error) {
    console.log('Failed to cancel booking', error);
    return { error: 'Failed to cancel booking' };
  }
}
