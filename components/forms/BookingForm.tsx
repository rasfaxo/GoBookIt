'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, memo, useId } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';

import bookRoom from '@/services/bookings/bookRoom';
import { useAuth } from '@/hooks';
import { Input, Button, Card, AvailabilityBanner } from '@/components';
import { STRINGS } from '@/constants/strings';
import { useAvailability, useBookingCost } from '@/hooks/booking';
import AuthNotice from './AuthNotice';
import CostSummary from './CostSummary';

interface BookingFormState { error?: string; success?: boolean }
interface BookingFormProps { room: { $id: string; price_per_hour?: number } }
type DateState = { inDate: string; inTime: string; outDate: string; outTime: string };

// --- Hooks ---
function useDateState() {
  const [dates, setDates] = useState<DateState>({ inDate: '', inTime: '', outDate: '', outTime: '' });
  const onFieldChange = useCallback((key: keyof DateState, value: string) => {
    setDates((d) => ({ ...d, [key]: value }));
  }, []);
  return { dates, onFieldChange } as const;
}

function useBookingSideEffects(state: BookingFormState, router: ReturnType<typeof useRouter>) {
  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else if (state.success) {
      toast.success(STRINGS.bookings.bookSuccess);
      router.push('/bookings');
    }
  }, [state, router]);
}

function useSubmitHandler(isAuthenticated: boolean, roomId: string, router: ReturnType<typeof useRouter>, formAction: (fd: FormData) => void) {
  return useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isAuthenticated) {
        toast.info(STRINGS.bookings.loginRequiredShort);
        router.push('/login?redirect=' + encodeURIComponent(`/rooms/${roomId}`));
        return;
      }
      formAction(new FormData(e.currentTarget));
    },
    [isAuthenticated, router, roomId, formAction]
  );
}

interface DateFieldsProps { dates: DateState; onChange: (key: keyof DateState, value: string) => void }
const DateFields = memo(({ dates, onChange }: DateFieldsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" aria-labelledby="booking-dates-heading">
    <Input type="date" name="check_in_date" label="Check-In Date" required value={dates.inDate} onChange={(e) => onChange('inDate', e.target.value)} />
    <Input type="time" name="check_in_time" label="Check-In Time" required value={dates.inTime} onChange={(e) => onChange('inTime', e.target.value)} />
    <Input type="date" name="check_out_date" label="Check-Out Date" required value={dates.outDate} onChange={(e) => onChange('outDate', e.target.value)} />
    <Input type="time" name="check_out_time" label="Check-Out Time" required value={dates.outTime} onChange={(e) => onChange('outTime', e.target.value)} />
  </div>
));

const BookingForm = ({ room }: BookingFormProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [state, formAction] = useActionState<BookingFormState, FormData>(bookRoom as unknown as any, {});
  const { dates, onFieldChange } = useDateState();
  const hours = useBookingCost(dates);
  const { status: availabilityStatus, isRangeValid } = useAvailability(room.$id, dates);
  const costLabelId = useId();
  const liveRegionId = useId();
  useBookingSideEffects(state, router);
  const handleSubmit = useSubmitHandler(isAuthenticated, room.$id, router, formAction);

  return (
    <div className="mt-6" aria-labelledby="booking-form-heading">
      <h2 id="booking-form-heading" className="text-lg font-semibold text-blue-800 dark:text-blue-100 mb-3">{STRINGS.rooms.bookThisRoom}</h2>
      {!isAuthenticated && (
        <AuthNotice onLogin={() => router.push('/login?redirect=' + encodeURIComponent(`/rooms/${room.$id}`))} />
      )}
      <form onSubmit={handleSubmit} aria-describedby={costLabelId} className="space-y-5" noValidate>
        <input type="hidden" name="room_id" value={room.$id} />
        <DateFields dates={dates} onChange={onFieldChange} />
        <div className="space-y-3">
          <CostSummary labelId={costLabelId} hours={hours} pricePerHour={room.price_per_hour || 0} />
          <AvailabilityBanner status={availabilityStatus} isRangeValid={isRangeValid} />
        </div>
        <div className="sr-only" id={liveRegionId} aria-live="assertive" aria-atomic="true">
          {state?.error ? `Error: ${state.error}` : state?.success ? STRINGS.bookings.bookSuccess : ''}
        </div>
        <Button type="submit" variant="primary" className="w-full font-semibold" disabled={!isAuthenticated} aria-disabled={!isAuthenticated}>{STRINGS.rooms.bookRoom}</Button>
      </form>
    </div>
  );
};

export default BookingForm;
