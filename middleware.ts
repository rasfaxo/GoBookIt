import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

// Lightweight auth check for middleware (cannot use cookies() from next/headers here)
export function middleware(request: NextRequest) {
  const session = request.cookies.get('appwrite-session');
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/bookings', '/rooms/add', '/rooms/my'],
};
