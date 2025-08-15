import Link from 'next/link';

import CancelBookingButton from '../ui/CancelBookingButton';

import type { BookingDoc } from '@/types/bookings';
import React from 'react';

// Allow room_id to be either a string id or a populated minimal room object
type BookingRoomRef = string | { $id: string; name: string };
interface ExtendedBookingDoc extends Omit<BookingDoc, 'room_id'> {
  room_id: BookingRoomRef;
}
interface BookedRoomCardProps {
  booking: ExtendedBookingDoc;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  });
  return `${month} ${day} at ${time}`;
};
const BookedRoomCardBase = ({ booking }: BookedRoomCardProps) => {
  const rawRoom = booking.room_id;

  // Safely extract an ID string from multiple possible shapes that may appear
  const extractId = (val: unknown): string | undefined => {
    if (!val) return undefined;
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      const obj: any = val as any;
      // common fields
      if (typeof obj.$id === 'string') return obj.$id;
      if (typeof obj.id === 'string') return obj.id;
      // sometimes the id may be nested inside another object
      if (obj.$id && typeof obj.$id === 'object') {
        if (typeof obj.$id.$id === 'string') return obj.$id.$id;
        if (typeof obj.$id.id === 'string') return obj.$id.id;
      }
    }
    return undefined;
  };

  const roomId = extractId(rawRoom);
  const roomName = typeof rawRoom === 'object' && rawRoom ? (rawRoom as any).name || 'Room' : 'Room';

  return (
    <div className="bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
  <h4 className="text-lg font-semibold">{roomName}</h4>
        <p className="text-sm text-gray-600">
          <strong>Check In:</strong> {formatDate(booking.check_in)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Check Out:</strong> {formatDate(booking.check_out)}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0">
    {typeof roomId === 'string' ? (
          <Link
      href={`/rooms/${roomId}`}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700"
          >
            View Room
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center"
          >
            View Room
          </button>
        )}
        <CancelBookingButton bookingId={booking.$id} />
      </div>
    </div>
  );
};
const BookedRoomCard = React.memo(BookedRoomCardBase, (a,b)=> a.booking.$id === b.booking.$id && a.booking.check_in === b.booking.check_in && a.booking.check_out === b.booking.check_out);
BookedRoomCard.displayName = 'BookedRoomCard';
export default BookedRoomCard;
