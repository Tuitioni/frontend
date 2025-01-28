import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(`${process.env.TUITIONI_API}/teacher-profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log('Profile Creation Response:', {
      status: response.status,
      body: responseText
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create teacher profile' },
        { status: response.status }
      );
    }

    const responseData = responseText ? JSON.parse(responseText) : null;
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error creating teacher profile:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher profile' },
      { status: 500 }
    );
  }
} 