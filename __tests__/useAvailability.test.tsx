import { renderHook, act } from '@testing-library/react';
import { useAvailability } from '@/hooks/booking/useAvailability';

jest.mock('@/services/rooms/checkRoomAvailability', () => ({
  __esModule: true,
  default: jest.fn(async () => true),
}));

const mockCheck = require('@/services/rooms/checkRoomAvailability').default as jest.Mock;

function advance(ms: number) {
  jest.advanceTimersByTime(ms);
}

describe('useAvailability', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockCheck.mockResolvedValue(true);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const baseDates = { inDate: '2025-08-16', inTime: '09:00', outDate: '2025-08-16', outTime: '10:00' };

  it('starts idle until all parts present', () => {
    const { result, rerender } = renderHook(({ dates }) => useAvailability('room1', dates), { initialProps: { dates: { ...baseDates, outTime: '' } } });
    expect(result.current.status).toBe('idle');
    rerender({ dates: baseDates });
    expect(result.current.status).toBe('checking');
  });

  it('marks invalid range and stays idle', () => {
    const bad = { ...baseDates, outTime: '08:00' };
    const { result } = renderHook(() => useAvailability('room1', bad));
    expect(result.current.isRangeValid).toBe(false);
    expect(result.current.status).toBe('idle');
  });

  it('becomes available after debounce when API resolves true', async () => {
    const { result } = renderHook(() => useAvailability('room1', baseDates));
    expect(result.current.status).toBe('checking');
    act(() => advance(310));
    // flush microtasks
    await act(async () => {});
    expect(result.current.status).toBe('available');
    expect(mockCheck).toHaveBeenCalledTimes(1);
  });

  it('unavailable when API returns false', async () => {
    mockCheck.mockResolvedValueOnce(false);
    const { result } = renderHook(() => useAvailability('room1', baseDates));
    act(() => advance(305));
    await act(async () => {});
    expect(result.current.status).toBe('unavailable');
  });

  it('error when API throws', async () => {
    mockCheck.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useAvailability('room1', baseDates));
    act(() => advance(305));
    await act(async () => {});
    expect(result.current.status).toBe('error');
  });
});
