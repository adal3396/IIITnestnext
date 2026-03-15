import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.NEXT_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin credentials are not configured on the server.' },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      const cookieStore = await cookies();
      
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid admin credentials.' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
