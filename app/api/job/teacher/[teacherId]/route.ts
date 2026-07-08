import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

/** A teacher's own applications. Backend restricts this to the teacher. */
export async function GET(request: NextRequest, { params }: { params: { teacherId: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${env.TUITIONI_API}/job/teacher/${params.teacherId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || 'Failed to load your applications' },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
