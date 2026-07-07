import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

/** Returns a student's hire requests. The backend restricts this to the student themselves. */
export async function GET(request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${env.TUITIONI_API}/hire/student/${params.studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || 'Failed to load hires' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
