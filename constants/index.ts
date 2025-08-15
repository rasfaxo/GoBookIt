// API endpoints (const assertions for literal inference)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    OAUTH: '/api/auth/oauth',
  },
  ROOMS: {
    LIST: '/api/rooms',
    CREATE: '/api/rooms/create',
    DELETE: '/api/rooms/delete',
    AVAILABILITY: '/api/rooms/availability',
  },
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings/create',
    CANCEL: '/api/bookings/cancel',
  },
} as const;
export type ApiGroup = keyof typeof API_ENDPOINTS;
export type AuthEndpoint = (typeof API_ENDPOINTS.AUTH)[keyof typeof API_ENDPOINTS.AUTH];

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'GoBookIt',
  APP_DESCRIPTION: 'Seamless meeting room booking for teams and professionals',
  PAGINATION_LIMIT: 10,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
} as const;

// Room booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;
export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MANAGER: 'manager',
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Form validation rules
export const VALIDATION_RULES = {
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  ROOM_NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
} as const;
