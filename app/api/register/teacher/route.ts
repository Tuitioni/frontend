import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Make request to external API
    const response = await fetch(`${process.env.TUITIONI_API}/teacher/signup`, {
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
        location: data.location,
      }),
    });

    const responseText = await response.text();
    console.log('Signup Response:', {
      status: response.status,
      body: responseText
    });

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from signup API' },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData?.error || `Signup failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Return the response from the external API
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register teacher' },
      { status: 500 }
    );
  }
}
