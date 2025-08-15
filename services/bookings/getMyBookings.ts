'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';

import checkAuth from '../auth/checkAuth';

import type { BookingDoc } from '@/types/bookings';

import { createSessionClient } from '@/lib/appwrite';
import { type ApiResult } from '../apiClient';
import { asBookingDoc } from '@/utils/validation';

export default async function getMyBookings(): Promise<ApiResult<BookingDoc[]>> {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) redirect('/login');
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { user } = await checkAuth();
    if (!user) return { ok: true, data: [] };
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!,
      [Query.equal('user_id', user.id)]
    );
    const mapped = bookings
      .map((b) => {
        try {
          return asBookingDoc(b) as BookingDoc;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as BookingDoc[];
    return { ok: true, data: mapped };
  } catch (error) {
    console.log('Failed to get user bookings', error);
    return { ok: false, error: 'Failed to load bookings', data: [] };
  }
}
