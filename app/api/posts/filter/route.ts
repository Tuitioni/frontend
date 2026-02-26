import { NextResponse } from 'next/server';

import { env } from '@/lib/env';

interface FilterBody {
  area: string;
  district: string;
  levelOfStudy: string;
}

export async function POST(request: Request) {
  try {
    const body: FilterBody = await request.json();

    const response = await fetch(`${env.TUITIONI_API}/post/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to filter posts' }, { status: 500 });
  }
}
