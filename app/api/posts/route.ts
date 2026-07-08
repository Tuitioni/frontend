import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

/**
 * Posts a tuition request without a prior sign-up. The backend creates or
 * links the student account and returns a session token (auto-login).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${env.TUITIONI_API}/post/quick`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || 'Failed to post your request' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
