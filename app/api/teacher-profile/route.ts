import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const data = await request.json();

    const response = await fetch(`${env.TUITIONI_API}/teacher-profile`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create teacher profile' },
        { status: response.status }
      );
    }

    const responseData = responseText ? JSON.parse(responseText) : null;
    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create teacher profile' }, { status: 500 });
  }
}
