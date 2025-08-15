'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
          <Input type="date" name="check_in_date" label="Check-In Date" required onChange={(e)=> setCalcHours(null)} />
          <Input type="time" name="check_in_time" label="Check-In Time" required onChange={(e)=> setCalcHours(null)} />
          <Input type="date" name="check_out_date" label="Check-Out Date" required onChange={(e)=> setCalcHours(null)} />
          <Input type="time" name="check_out_time" label="Check-Out Time" required onChange={(e)=> setCalcHours(null)} />
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
