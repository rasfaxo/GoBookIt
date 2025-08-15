'use client';
import { toast } from 'react-toastify';

import { cancelBookingApi } from '@/services/adapters';
import { STRINGS } from '@/constants/strings';

interface Props {
  bookingId: string;
}

const CancelBookingButton = ({ bookingId }: Props) => {
  const handleCancelClick = async () => {
    if (!confirm(STRINGS.bookings.cancelConfirm)) return;
    try {
      const result = await cancelBookingApi(bookingId);
      if (result.ok) toast.success(STRINGS.bookings.cancelSuccess);
      else toast.error(result.error || STRINGS.bookings.cancelError);
    } catch (error) {
      console.log('Failed to cancel booking', error);
      toast.error(STRINGS.bookings.cancelError);
    }
  };
  return (
    <button
      onClick={handleCancelClick}
      className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
    >
      Cancel Booking
    </button>
  );
};
export default CancelBookingButton;
