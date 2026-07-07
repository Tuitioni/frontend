import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

/**
 * Proxies a direct hire request to the backend. The student is identified by
 * the bearer token (the backend derives studentId from it), so the body only
 * needs the teacherId (and optionally a postId).
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'You must be signed in as a student to hire a tutor.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body?.teacherId) {
      return NextResponse.json({ error: 'teacherId is required' }, { status: 400 });
    }

    const response = await fetch(`${env.TUITIONI_API}/hire`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        teacherId: body.teacherId,
        ...(body.postId ? { postId: body.postId } : {}),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || 'Failed to hire tutor' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
