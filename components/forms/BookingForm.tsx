'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, memo } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';

import bookRoom from '@/services/bookings/bookRoom';
import { useAuth } from '@/hooks';
import { Input, Button, Card } from '@/components';
import { formatUSD } from '@/utils/currency';
import checkRoomAvailability from '@/services/rooms/checkRoomAvailability';
import { STRINGS } from '@/constants/strings';

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

// Hook: derive calculated hours & cost
function useBookingCost(dates: { inDate: string; inTime: string; outDate: string; outTime: string }) {
  const [hours, setHours] = useState<number | null>(null);
  useEffect(() => {
    if (dates.inDate && dates.inTime && dates.outDate && dates.outTime) {
      const start = new Date(`${dates.inDate}T${dates.inTime}`);
      const end = new Date(`${dates.outDate}T${dates.outTime}`);
      const diffMs = end.getTime() - start.getTime();
      if (diffMs > 0) {
        const raw = diffMs / 36e5;
        setHours(Math.max(0.5, Math.round(raw * 100) / 100));
      } else {
        setHours(null);
      }
    } else {
      setHours(null);
    }
  }, [dates]);
  return hours;
}

// Hook: availability checking (debounced)
function useAvailability(roomId: string, dates: { inDate: string; inTime: string; outDate: string; outTime: string }) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'error'>('idle');
  const [isRangeValid, setIsRangeValid] = useState(true);
  useEffect(() => {
    if (!(dates.inDate && dates.inTime && dates.outDate && dates.outTime)) {
      setStatus('idle');
      return;
    }
    const start = new Date(`${dates.inDate}T${dates.inTime}`);
    const end = new Date(`${dates.outDate}T${dates.outTime}`);
    const invalid = end.getTime() <= start.getTime();
    setIsRangeValid(!invalid);
    if (invalid) {
      setStatus('idle');
      return;
    }
    let active = true;
    setStatus('checking');
    const t = setTimeout(async () => {
      try {
        const ok = await checkRoomAvailability(roomId, start.toISOString(), end.toISOString());
        if (!active) return;
        setStatus(ok ? 'available' : 'unavailable');
      } catch {
        if (!active) return;
        setStatus('error');
      }
    }, 450); // debounce
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [roomId, dates]);
  return { status, isRangeValid } as const;
}

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
          <div
            className="rounded-md border border-blue-100 bg-white/60 dark:bg-blue-900/30 dark:border-blue-800 px-3 py-2 text-[12px] font-medium flex items-center gap-2"
            aria-live="polite"
          >
            {!isRangeValid && (
              <span className="text-red-600 dark:text-red-400">{STRINGS.bookings.dateRangeInvalid}</span>
            )}
            {isRangeValid && availabilityStatus === 'idle' && <span className="text-blue-600/70">—</span>}
            {isRangeValid && availabilityStatus === 'checking' && (
              <span className="text-blue-600 animate-pulse">{STRINGS.bookings.availabilityChecking}</span>
            )}
            {isRangeValid && availabilityStatus === 'available' && (
              <span className="text-green-600 dark:text-green-400">{STRINGS.bookings.availabilityAvailable}</span>
            )}
            {isRangeValid && availabilityStatus === 'unavailable' && (
              <span className="text-red-600 dark:text-red-400">{STRINGS.bookings.availabilityUnavailable}</span>
            )}
            {isRangeValid && availabilityStatus === 'error' && (
              <span className="text-amber-600 dark:text-amber-400">{STRINGS.bookings.availabilityError}</span>
            )}
          </div>
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
