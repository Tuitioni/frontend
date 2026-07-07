import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Backend route is singular: /post/filter
    const response = await fetch(`${env.TUITIONI_API}/post/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        area: body.area || '',
        district: body.district || '',
        levelOfStudy: body.levelOfStudy || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to filter jobs' }, { status: 500 });
  }
}
