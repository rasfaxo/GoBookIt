'use server';
import { DateTime } from 'luxon';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';

import { createSessionClient } from '@/lib/appwrite';

function toUTCDateTime(dateString: string): DateTime {
  return DateTime.fromISO(dateString, { zone: 'utc' }).toUTC();
}

function dateRangesOverlap(
  aStart: DateTime,
  aEnd: DateTime,
  bStart: DateTime,
  bEnd: DateTime
) {
  return aStart < bEnd && aEnd > bStart;
}

export default async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const sessionCookie = (await cookies()).get('appwrite-session');
  if (!sessionCookie) redirect('/login');
  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const checkInDt = toUTCDateTime(checkIn);
    const checkOutDt = toUTCDateTime(checkOut);
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS!,
      [Query.equal('room_id', roomId)]
    );
    for (const booking of bookings) {
      const bStart = toUTCDateTime(booking.check_in);
      const bEnd = toUTCDateTime(booking.check_out);
      if (dateRangesOverlap(checkInDt, checkOutDt, bStart, bEnd)) return false;
    }
    return true;
  } catch (error) {
    console.log('Failed to check availability', error);
    return false;
  }
}
