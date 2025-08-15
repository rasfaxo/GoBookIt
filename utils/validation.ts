// --- Room Document Helpers ---
export function asRoomDoc(raw: any) {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid room record');
  const base = createBaseRoomDoc(raw);
  if (!base.$id || !base.name) throw new Error('Missing required room fields');
  return base;
}

function createBaseRoomDoc(raw: any) {
  return {
    $id: extractString(raw.$id || ''),
    name: extractString(raw.name || ''),
    description: extractOptionalString(raw.description),
    sqft: extractOptionalNumber(raw.sqft),
    availability: extractOptionalString(raw.availability),
    price_per_hour: extractOptionalNumber(raw.price_per_hour),
    address: extractOptionalString(raw.address),
    image: extractOptionalString(raw.image),
    user_id: extractString(raw.user_id || ''),
  };
}

function extractString(value: any): string {
  return String(value);
}

function extractOptionalString(value: any): string | undefined {
  return value ? String(value) : undefined;
}

function extractOptionalNumber(value: any): number | undefined {
  return value != null ? Number(value) : undefined;
}

// --- Booking Document Helpers ---
function createBookingDoc(raw: any) {
  return {
    $id: String(raw.$id || ''),
    room_id: String(raw.room_id || ''),
    user_id: String(raw.user_id || ''),
    check_in: String(raw.check_in || ''),
    check_out: String(raw.check_out || ''),
  };
}

export function asBookingDoc(raw: any) {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid booking record');
  return createBookingDoc(raw);
}

// ---- General legacy helpers (converted) ----
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function validateRequiredFields(data: Record<string, unknown>, required: string[]) {
  const errors: Record<string, string> = {};
  for (const field of required) {
    const value = data[field];
    if (value == null || value.toString().trim() === '') {
      errors[field] = `${field} is required`;
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>"']/g, '');
}

// ---------- FormData validation ----------
export interface CreateRoomInput {
  name: string;
  description?: string;
  sqft?: number;
  capacity?: number;
  location?: string;
  address?: string;
  availability?: string;
  price_per_hour?: number;
  amenities?: string;
  image?: File | null;
}

export function parseCreateRoomForm(formData: FormData): CreateRoomInput | { error: string } {
  const name = (formData.get('name') || '').toString().trim();
  if (!name) return { error: 'Name is required' };
  const numberOrUndefined = (v: FormDataEntryValue | null) => {
    if (v == null || v === '') return undefined;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };
  return {
    name,
    description: formData.get('description')?.toString().trim() || undefined,
    sqft: numberOrUndefined(formData.get('sqft')),
    capacity: numberOrUndefined(formData.get('capacity')),
    location: formData.get('location')?.toString().trim() || undefined,
    address: formData.get('address')?.toString().trim() || undefined,
    availability: formData.get('availability')?.toString().trim() || undefined,
    price_per_hour: numberOrUndefined(formData.get('price_per_hour')),
    amenities: formData.get('amenities')?.toString().trim() || undefined,
    image: (formData.get('image') as File) || null,
  };
}

export interface BookRoomInput {
  room_id: string;
  check_in: string;
  check_out: string;
}

export function parseBookRoomForm(formData: FormData): BookRoomInput | { error: string } {
  const roomId = formData.get('room_id')?.toString();
  const inDate = formData.get('check_in_date')?.toString();
  const inTime = formData.get('check_in_time')?.toString();
  const outDate = formData.get('check_out_date')?.toString();
  const outTime = formData.get('check_out_time')?.toString();
  if (!roomId || !inDate || !inTime || !outDate || !outTime)
    return { error: 'All booking fields are required' };
  const check_in = `${inDate}T${inTime}`;
  const check_out = `${outDate}T${outTime}`;
  if (check_in >= check_out) return { error: 'Check-out must be after check-in' };
  return { room_id: roomId, check_in, check_out };
}
