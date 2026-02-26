import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const apiUrl = `${env.TUITIONI_API}/teacher/${params.id}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (response.status === 401 || responseData.statusCode === 401) {
      return NextResponse.json({ error: 'Unauthorized - Session expired' }, { status: 401 });
    }

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch profile');
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch teacher profile',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json();

    const apiUrl = `${env.TUITIONI_API}/teacher/${params.id}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (response.status === 401 || responseData.statusCode === 401) {
      return NextResponse.json({ error: 'Unauthorized - Session expired' }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Failed to update profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to update profile',
      },
      { status: 500 }
    );
  }
}
