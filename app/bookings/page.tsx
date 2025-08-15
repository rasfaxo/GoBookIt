import type { BookingDoc } from '@/types/bookings';

import { Heading, BookedRoomCard, EmptyState } from '@/components';
import getMyBookings from '@/services/bookings/getMyBookings';

const BookingsPage = async () => {
  const bookingsResult = await getMyBookings();
  const bookings = bookingsResult.ok ? (bookingsResult.data as BookingDoc[]) : [];

  return (
    <>
  <Heading title="My Bookings" subtitle="View and manage all your room bookings" />
      {bookings.length === 0 ? (
  <EmptyState title="No bookings yet" message="You don't have any active bookings. Book a room to get started." />
      ) : (
        bookings.map((booking) => <BookedRoomCard key={booking.$id} booking={booking} />)
      )}
    </>
  );
};

export default BookingsPage;
