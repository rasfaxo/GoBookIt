import type { BookingDoc } from '@/types/bookings';

import { Heading, BookedRoomCard, EmptyState } from '@/components';
import getMyBookings from '@/services/bookings/getMyBookings';

const BookingsPage = async () => {
  const bookings = (await getMyBookings()) as BookingDoc[]; // may contain expanded room objects

  return (
    <>
      <Heading title="My Bookings" subtitle="Lihat dan kelola semua pemesanan ruang Anda" />
      {bookings.length === 0 ? (
        <EmptyState title="Tidak ada booking" message="Anda belum memiliki booking aktif. Pesan ruang untuk mulai menggunakannya." />
      ) : (
        bookings.map((booking) => <BookedRoomCard key={booking.$id} booking={booking} />)
      )}
    </>
  );
};

export default BookingsPage;
