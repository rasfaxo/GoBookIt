'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, memo } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';

import bookRoom from '@/services/bookings/bookRoom';
import { useAuth } from '@/hooks';
import { Input, Button, Card } from '@/components';
import { formatUSD } from '@/utils/currency';
import { STRINGS } from '@/constants/strings';
import { AvailabilityBanner } from '@/components';
import { useAvailability, useBookingCost } from '@/hooks/booking';

interface BookingFormState {
  error?: string;
  success?: boolean;
}
interface BookingFormProps {
  room: { $id: string };
}

// Subcomponent: cluster of date/time inputs
interface DateFieldsProps {
  dates: { inDate: string; inTime: string; outDate: string; outTime: string };
  onChange: (key: keyof DateFieldsProps['dates'], value: string) => void;
}
const DateFields = memo(function DateFields({ dates, onChange }: DateFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" aria-labelledby="booking-dates-heading">
      <Input
        type="date"
        name="check_in_date"
        label="Check-In Date"
        required
        onChange={(e) => onChange('inDate', e.target.value)}
        value={dates.inDate}
      />
      <Input
        type="time"
        name="check_in_time"
        label="Check-In Time"
        required
        onChange={(e) => onChange('inTime', e.target.value)}
        value={dates.inTime}
      />
      <Input
        type="date"
        name="check_out_date"
        label="Check-Out Date"
        required
        onChange={(e) => onChange('outDate', e.target.value)}
        value={dates.outDate}
      />
      <Input
        type="time"
        name="check_out_time"
        label="Check-Out Time"
        required
        onChange={(e) => onChange('outTime', e.target.value)}
        value={dates.outTime}
      />
    </div>
  );
});

const BookingForm = ({ room }: BookingFormProps) => {
  const action = bookRoom as unknown as (
    prevState: BookingFormState,
    formData: FormData
  ) => Promise<BookingFormState>;
  const [state, formAction] = useActionState<BookingFormState, FormData>(action, {});
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [dates, setDates] = useState({ inDate: '', inTime: '', outDate: '', outTime: '' });
  const hours = useBookingCost(dates);
  const { status: availabilityStatus, isRangeValid } = useAvailability(room.$id, dates);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success('Room has been booked!');
      router.push('/bookings');
    }
  }, [state, router]);


  const onFieldChange = useCallback((key: keyof typeof dates, value: string) => {
    setDates((d) => ({ ...d, [key]: value }));
  }, []);
  const costLabelId = 'estimated-cost-label';
  const liveRegionId = 'booking-live';
  return (
    <div className="mt-6" aria-labelledby="booking-form-heading">
      <h2 id="booking-form-heading" className="text-lg font-semibold text-blue-800 dark:text-blue-100 mb-3">Book this Room</h2>
      {!isAuthenticated && (
        <Card className="p-4 mb-4 border-amber-300 bg-amber-50/80 dark:bg-amber-900/30 dark:border-amber-600">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            You must log in first to book a room.
            <Button
              size="sm"
              variant="primary"
              className="ml-3"
              onClick={() => router.push('/login?redirect=' + encodeURIComponent(`/rooms/${room.$id}`))}
            >
              Login
            </Button>
          </p>
        </Card>
      )}
      <form
        action={(formData) => {
          if (!isAuthenticated) {
            toast.info('Please login first.');
            router.push('/login?redirect=' + encodeURIComponent(`/rooms/${room.$id}`));
            return; // prevent submit
          }
          return formAction(formData);
        }}
        className="space-y-6"
        aria-describedby={costLabelId}
      >
        <input type="hidden" name="room_id" value={room.$id} />
        <DateFields dates={dates} onChange={onFieldChange} />

        <div className="space-y-3">
          <div
            className="rounded-md border border-blue-100 bg-white/70 dark:bg-blue-900/40 dark:border-blue-800 px-4 py-3 text-sm flex items-center justify-between"
            aria-live="polite"
            aria-atomic="true"
          >
            <span id={costLabelId} className="text-blue-700 dark:text-blue-200 font-medium">{STRINGS.rooms.estimatedCost}</span>
            <span className="font-semibold text-blue-800 dark:text-blue-100">
              {hours !== null ? `${formatUSD((room as any).price_per_hour * hours)} (${hours}h)` : '—'}
            </span>
          </div>
          <AvailabilityBanner status={availabilityStatus} isRangeValid={isRangeValid} />
        </div>
        <div className="sr-only" id={liveRegionId} aria-live="assertive" aria-atomic="true">
          {state?.error ? `Error: ${state.error}` : state?.success ? 'Booking successful' : ''}
        </div>
        <Button type="submit" variant="primary" className="w-full font-semibold" disabled={!isAuthenticated} aria-disabled={!isAuthenticated}>
          Book Room
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
