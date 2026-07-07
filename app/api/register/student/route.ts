import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const response = await fetch(`${env.TUITIONI_API}/student/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        district: data.district,
        area: data.area,
      }),
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid response from signup API' }, { status: 502 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData?.error || `Signup failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register student' }, { status: 500 });
  }
}
