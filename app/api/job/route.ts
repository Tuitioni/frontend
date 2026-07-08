import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

/**
 * A teacher applies to a post. The teacher is identified by the bearer token
 * (the backend derives teacherId from it), so the body carries postId and the
 * expected salary.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'You must be signed in as a tutor to apply.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body?.postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    const response = await fetch(`${env.TUITIONI_API}/job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        postId: body.postId,
        expected_salary: Number(body.expected_salary) || 0,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || 'Failed to apply' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
