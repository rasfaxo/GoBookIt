export interface DateRangeValidation {
  valid: boolean;
  reason?: 'incomplete' | 'order';
}

export function hasAllParts(d: {
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
}) {
  return !!(d.inDate && d.inTime && d.outDate && d.outTime);
}

export function buildRange(d: {
  inDate: string;
  inTime: string;
  outDate: string;
  outTime: string;
}) {
  return {
    start: new Date(`${d.inDate}T${d.inTime}`),
    end: new Date(`${d.outDate}T${d.outTime}`),
  };
}

export function validateRange(start: Date, end: Date): DateRangeValidation {
  const startInvalid = !(start instanceof Date) || isNaN(start.getTime());
  const endInvalid = !(end instanceof Date) || isNaN(end.getTime());
  if (startInvalid || endInvalid) return { valid: false, reason: 'incomplete' };
  if (end.getTime() <= start.getTime()) return { valid: false, reason: 'order' };
  return { valid: true };
}
