'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';

import checkAuth from '../auth/checkAuth';

import type { BookingDoc } from '@/types/bookings';

import { createSessionClient } from '@/lib/appwrite';
import { asBookingDoc } from '@/utils/validation';

export default async function getMyBookings(): Promise<BookingDoc[]> {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) redirect('/login');
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { user } = await checkAuth();
    if (!user) return [];
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!,
      [Query.equal('user_id', user.id)]
    );
    return bookings
      .map((b) => {
        try {
          return asBookingDoc(b) as BookingDoc;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as BookingDoc[];
  } catch (error) {
    console.log('Failed to get user bookings', error);
    return [];
  }
}
