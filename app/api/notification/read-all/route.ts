import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const response = await fetch(`${env.TUITIONI_API}/notification/read-all`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Failed to update notifications' },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
