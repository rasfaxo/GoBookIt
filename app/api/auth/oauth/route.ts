'use server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { jwt } = await request.json();
    if (!jwt) throw new Error('Missing JWT');
    (await cookies()).set('appwrite-session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return NextResponse.json({ ok: true });
  } catch {
    (await cookies()).delete('appwrite-session');
    return NextResponse.json({ ok: false, error: 'Unable to persist session' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
  );
}
