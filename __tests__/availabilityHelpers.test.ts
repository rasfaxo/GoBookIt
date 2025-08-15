import { hasAllParts, buildRange, validateRange } from '@/utils/booking/availabilityHelpers';

describe('availabilityHelpers', () => {
  const base = { inDate: '2025-08-16', inTime: '09:00', outDate: '2025-08-16', outTime: '10:00' };

  test('hasAllParts false when any missing', () => {
    expect(hasAllParts({ ...base, inDate: '' })).toBe(false);
    expect(hasAllParts({ ...base, inTime: '' })).toBe(false);
    expect(hasAllParts({ ...base, outDate: '' })).toBe(false);
    expect(hasAllParts({ ...base, outTime: '' })).toBe(false);
  });

  test('hasAllParts true when complete', () => {
    expect(hasAllParts(base)).toBe(true);
  });

  test('buildRange returns correct Date objects', () => {
    const { start, end } = buildRange(base);
    expect(start.toISOString()).toBe(new Date('2025-08-16T09:00').toISOString());
    expect(end.toISOString()).toBe(new Date('2025-08-16T10:00').toISOString());
  });

  test('validateRange flags incomplete', () => {
    // Construct invalid date via Date('')
    const res = validateRange(new Date('invalid'), new Date('2025-08-16T10:00'));
    expect(res.valid).toBe(false);
    expect(res.reason).toBe('incomplete');
  });

  test('validateRange flags order problem', () => {
    const res = validateRange(new Date('2025-08-16T10:00'), new Date('2025-08-16T09:59'));
    expect(res.valid).toBe(false);
    expect(res.reason).toBe('order');
  });

  test('validateRange ok for forward range', () => {
    const res = validateRange(new Date('2025-08-16T09:00'), new Date('2025-08-16T11:00'));
    expect(res.valid).toBe(true);
    expect(res.reason).toBeUndefined();
  });
});
