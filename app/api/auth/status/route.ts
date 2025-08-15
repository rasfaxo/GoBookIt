import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createSessionClient } from '@/lib/appwrite';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }
    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();
    return NextResponse.json({
      isAuthenticated: true,
      user: { id: user.$id, name: user.name, email: user.email },
    });
  } catch {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}
