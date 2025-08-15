import { useEffect, useState } from 'react';
import checkRoomAvailability from '@/services/rooms/checkRoomAvailability';

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

export interface BookingDates { inDate: string; inTime: string; outDate: string; outTime: string; }

export function useAvailability(roomId: string, dates: BookingDates) {
  const [status, setStatus] = useState<AvailabilityStatus>('idle');
  const [isRangeValid, setIsRangeValid] = useState(true);
  useEffect(() => {
    const { inDate, inTime, outDate, outTime } = dates;
    if (!(inDate && inTime && outDate && outTime)) { setStatus('idle'); return; }
    const start = new Date(`${inDate}T${inTime}`);
    const end = new Date(`${outDate}T${outTime}`);
    const invalid = end.getTime() <= start.getTime();
    setIsRangeValid(!invalid);
    if (invalid) { setStatus('idle'); return; }
    let active = true;
    setStatus('checking');
    const t = setTimeout(async () => {
      try { const ok = await checkRoomAvailability(roomId, start.toISOString(), end.toISOString()); if (!active) return; setStatus(ok ? 'available' : 'unavailable'); }
      catch { if (!active) return; setStatus('error'); }
    }, 450);
    return () => { active = false; clearTimeout(t); };
  }, [roomId, dates]);
  return { status, isRangeValid } as const;
}
