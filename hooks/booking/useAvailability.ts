import { useEffect, useState } from 'react';
import checkRoomAvailability from '@/services/rooms/checkRoomAvailability';
import { hasAllParts, buildRange, validateRange } from '@/utils/booking/availabilityHelpers';

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

export interface BookingDates {
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
}

export function useAvailability(roomId: string, dates: BookingDates) {
  const [status, setStatus] = useState<AvailabilityStatus>('idle');
  const [isRangeValid, setIsRangeValid] = useState(true);

  useEffect(() => {
    if (!hasAllParts(dates)) {
      setStatus('idle');
      return; // incomplete
    }
    const { start, end } = buildRange(dates);
    const { valid } = validateRange(start, end);
    setIsRangeValid(valid);
    if (!valid) {
      setStatus('idle');
      return; // invalid ordering
    }
    let active = true;
    setStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const ok = await checkRoomAvailability(roomId, start.toISOString(), end.toISOString());
        if (!active) return;
        setStatus(ok ? 'available' : 'unavailable');
      } catch {
        if (!active) return;
        setStatus('error');
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [roomId, dates]);

  return { status, isRangeValid } as const;
}
