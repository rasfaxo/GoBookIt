'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useActionState } from 'react';
import { toast } from 'react-toastify';

import bookRoom from '@/services/bookings/bookRoom';
import { useAuth } from '@/hooks';
import { Input, Button, Card } from '@/components';
import { formatUSD } from '@/utils/currency';

interface BookingFormState {
  error?: string;
  success?: boolean;
}
interface BookingFormProps {
  room: { $id: string };
}

const BookingForm = ({ room }: BookingFormProps) => {
  const action = bookRoom as unknown as (
    prevState: BookingFormState,
    formData: FormData
  ) => Promise<BookingFormState>;
  const [state, formAction] = useActionState<BookingFormState, FormData>(action, {});
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [calcHours, setCalcHours] = useState<number | null>(null);
  const [dates, setDates] = useState({ inDate: '', inTime: '', outDate: '', outTime: '' });

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success('Room has been booked!');
      router.push('/bookings');
    }
  }, [state, router]);

  useEffect(() => {
    if (dates.inDate && dates.inTime && dates.outDate && dates.outTime) {
      const start = new Date(`${dates.inDate}T${dates.inTime}`);
      const end = new Date(`${dates.outDate}T${dates.outTime}`);
      const diffMs = end.getTime() - start.getTime();
      if (diffMs > 0) {
        const hours = diffMs / (1000 * 60 * 60);
        setCalcHours(Math.max(0.5, Math.round(hours * 100) / 100));
      } else {
        setCalcHours(null);
      }
    } else {
      setCalcHours(null);
    }
  }, [dates]);

  const onFieldChange = useCallback((key: keyof typeof dates, value: string) => {
    setDates((d) => ({ ...d, [key]: value }));
  }, []);
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-100 mb-3">Book this Room</h2>
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
      >
        <input type="hidden" name="room_id" value={room.$id} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input type="date" name="check_in_date" label="Check-In Date" required onChange={(e)=> onFieldChange('inDate', e.target.value)} />
          <Input type="time" name="check_in_time" label="Check-In Time" required onChange={(e)=> onFieldChange('inTime', e.target.value)} />
          <Input type="date" name="check_out_date" label="Check-Out Date" required onChange={(e)=> onFieldChange('outDate', e.target.value)} />
          <Input type="time" name="check_out_time" label="Check-Out Time" required onChange={(e)=> onFieldChange('outTime', e.target.value)} />
        </div>

        <div className="rounded-md border border-blue-100 bg-white/70 dark:bg-blue-900/40 dark:border-blue-800 px-4 py-3 text-sm flex items-center justify-between">
          <span className="text-blue-700 dark:text-blue-200 font-medium">Estimated Cost</span>
          <span className="font-semibold text-blue-800 dark:text-blue-100">
            {calcHours !== null ? `${formatUSD((room as any).price_per_hour * calcHours)} (${calcHours}h)` : '—'}
          </span>
        </div>
        <Button type="submit" variant="primary" className="w-full font-semibold" disabled={!isAuthenticated}>
          Book Room
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
