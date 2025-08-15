import type { BookingDoc } from '@/types/bookings';

import { Heading, BookedRoomCard } from '@/components';
import getMyBookings from '@/services/bookings/getMyBookings';

const BookingsPage = async () => {
  const bookings = (await getMyBookings()) as BookingDoc[]; // may contain expanded room objects

  return (
    <>
      <Heading title="My Bookings" />
      {bookings.length === 0 ? (
        <p className="text-gray-600 mt-4">You have no bookings</p>
      ) : (
        bookings.map((booking) => <BookedRoomCard key={booking.$id} booking={booking} />)
      )}
    </>
  );
};

export default BookingsPage;
