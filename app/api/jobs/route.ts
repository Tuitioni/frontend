import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = await fetch(`${process.env.TUITIONI_API}/post`, {
    method: "GET",
  });

  const res = await response.json();
  return NextResponse.json(res);
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the body: Ensure at least one of the allowed properties is present
    const allowedProperties = [
      "gender",
      "area",
      "district",
      "teachingLevel",
      "medium",
    ];

    const hasValidProperty = Object.keys(body).some((key) =>
      allowedProperties.includes(key)
    );

    if (!hasValidProperty) {
      return NextResponse.json(
        {
          error: "At least one valid property is required in the request body",
        },
        { status: 400 }
      );
    }

    // Fetch data from the external API
    const response = await fetch(`${process.env.TUTIONI_API}/post/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to filter posts" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Filtered posts:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error filtering post data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
