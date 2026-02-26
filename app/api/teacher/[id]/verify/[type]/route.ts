import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const formData = await request.formData();

    // Validate document type
    const validTypes = ['nid', 'birth-certificate', 'passport'];
    if (!validTypes.includes(params.type)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
    }

    const apiUrl = `${env.TUITIONI_API}/teacher/${params.id}/verify/${params.type}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Pass the original formData directly
    });

    const responseData = await response.json();

    if (response.status === 401 || responseData.statusCode === 401) {
      return NextResponse.json({ error: 'Unauthorized - Session expired' }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Failed to verify document' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to verify document',
      },
      { status: 500 }
    );
  }
}
