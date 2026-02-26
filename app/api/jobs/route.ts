import { NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function GET(request: Request) {
  try {
    const response = await fetch(`${env.TUITIONI_API}/post`, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: response.status });
    }

    const jobs = await response.json();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const ALLOWED_FILTER_PROPERTIES = ['gender', 'area', 'district', 'teachingLevel', 'medium'];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const hasValidProperty = Object.keys(body).some((key) =>
      ALLOWED_FILTER_PROPERTIES.includes(key)
    );

    if (!hasValidProperty) {
      return NextResponse.json(
        { error: 'At least one valid filter property is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${env.TUITIONI_API}/post/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to filter posts' }, { status: response.status });
    }

    const filteredPosts = await response.json();
    return NextResponse.json(filteredPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
