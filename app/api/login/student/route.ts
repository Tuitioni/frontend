import { NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function POST(request: Request) {
  try {
    const { username: identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const response = await fetch(`${env.TUITIONI_API}/auth/login/student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const res = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: res.message || 'Login failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
