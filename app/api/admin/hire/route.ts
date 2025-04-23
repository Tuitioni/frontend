import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure dynamic handling

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendApiUrl = process.env.TUITIONI_API;
  if (!backendApiUrl) {
    console.error("TUITIONI_API environment variable is not set.");
    return NextResponse.json(
      { error: "Internal server configuration error" },
      { status: 500 }
    );
  }

  try {
    // Use the /hire endpoint
    const response = await fetch(`${backendApiUrl}/hire`, {
      method: "GET",
      headers: { Authorization: authorization },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch hires from backend" },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching hires:", error);
    return NextResponse.json(
      { error: "Failed to fetch hires" },
      { status: 500 }
    );
  }
}

// Optional: Add POST for creating tuitions if needed, similar structure
