// Adapters: wrap existing server actions returning action-style states into ApiResult shape
import type { ApiResult } from './apiClient';
import createRoom from './rooms/createRoom';
import bookRoom from './bookings/bookRoom';
import cancelBooking from './bookings/cancelBooking';
import deleteRoom from './rooms/deleteRoom';

export async function createRoomApi(formData: FormData): Promise<ApiResult<{ success: true }>> {
  const res = await createRoom({}, formData);
  if (res.success) return { ok: true, data: { success: true } };
  return { ok: false, error: res.error || 'Failed to create room' };
}

export async function bookRoomApi(formData: FormData): Promise<ApiResult<unknown>> {
  const res = await bookRoom({}, formData as any);
  if (res.success) return { ok: true, data: res.data };
  return { ok: false, error: res.error || 'Failed to book room' };
}

export async function cancelBookingApi(id: string): Promise<ApiResult<{ success: true }>> {
  const res = await cancelBooking(id);
  if (res.success) return { ok: true, data: { success: true } };
  return { ok: false, error: res.error || 'Failed to cancel booking' };
}

export async function deleteRoomApi(id: string): Promise<ApiResult<{ success: true }>> {
  const res = await deleteRoom(id);
  if (res.success) return { ok: true, data: { success: true } };
  return { ok: false, error: res.error || 'Failed to delete room' };
}
