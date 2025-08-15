import { useEffect, useState } from 'react';

export interface BookingDates { inDate: string; inTime: string; outDate: string; outTime: string; }

export function useBookingCost(dates: BookingDates) {
  const [hours, setHours] = useState<number | null>(null);
  useEffect(() => {
    const { inDate, inTime, outDate, outTime } = dates;
    if (inDate && inTime && outDate && outTime) {
      const start = new Date(`${inDate}T${inTime}`);
      const end = new Date(`${outDate}T${outTime}`);
      const diff = end.getTime() - start.getTime();
      if (diff > 0) {
        const raw = diff / 36e5;
        setHours(Math.max(0.5, Math.round(raw * 100) / 100));
        return;
      }
    }
    setHours(null);
  }, [dates]);
  return hours;
}
