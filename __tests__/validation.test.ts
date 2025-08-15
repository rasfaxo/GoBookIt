import { parseCreateRoomForm, parseBookRoomForm } from '@/utils/validation';

describe('validation utils', () => {
  test('parseCreateRoomForm success', () => {
    const fd = new FormData();
    fd.set('name', 'Room A');
    const res = parseCreateRoomForm(fd);
    if ('error' in res) throw new Error('unexpected error');
    expect(res.name).toBe('Room A');
  });

  test('parseCreateRoomForm error for missing name', () => {
    const fd = new FormData();
    const res = parseCreateRoomForm(fd);
    expect('error' in res).toBe(true);
  });

  test('parseBookRoomForm times', () => {
    const fd = new FormData();
    fd.set('room_id', 'r1');
    fd.set('check_in_date', '2025-01-01');
    fd.set('check_in_time', '09:00');
    fd.set('check_out_date', '2025-01-01');
    fd.set('check_out_time', '10:00');
    const res = parseBookRoomForm(fd);
    if ('error' in res) throw new Error('unexpected error');
    expect(res.check_in).toBe('2025-01-01T09:00');
  });
});
