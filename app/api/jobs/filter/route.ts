import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${process.env.TUITIONI_API}/posts/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        area: body.area || "",
        district: body.district || "",
        levelOfStudy: body.levelOfStudy || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in /api/jobs/filter:', error);
    return NextResponse.json(
      { error: 'Failed to filter jobs' },
      { status: 500 }
    );
  }
} 