import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader );

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const apiUrl = `${process.env.TUITIONI_API}/teacher-profile/${params.id}`;
    console.log('Making request to:', apiUrl);
    console.log('Making request to api:', process.env.TUITIONI_API);


    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    console.log('External API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText
    });

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      return NextResponse.json(
        { error: 'Invalid response from external API' },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || `API error: ${response.status} - ${response.statusText}` },
        { status: response.status }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No data received from external API' },
        { status: 502 }
      );
    }

    // Log successful data
    console.log('Parsed API Response:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch teacher profile' },
      { status: 500 }
    );
  }
} 