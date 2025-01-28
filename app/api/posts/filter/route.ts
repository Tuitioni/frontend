import { NextResponse } from "next/server";

interface FilterBody {
  area: string;
  district: string;
  levelOfStudy: string;
}

export async function POST(request: Request) {
  try {
    const body: FilterBody = await request.json();

    console.log(body)

    const response = await fetch(`${process.env.TUITIONI_API}/post/filter`, {
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
    console.error('Error filtering posts:', error);
    return NextResponse.json(
      { error: 'Failed to filter posts' },
      { status: 500 }
    );
  }
} 