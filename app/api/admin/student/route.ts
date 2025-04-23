import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  if (!authorization)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const backendApiUrl = process.env.TUITIONI_API;
  if (!backendApiUrl) {
    console.error("TUITIONI_API environment variable is not set.");
    return NextResponse.json(
      { error: "Internal server configuration error" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${backendApiUrl}/student`, {
      method: "GET",
      headers: { Authorization: authorization },
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch students from backend" },
        { status: response.status }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
