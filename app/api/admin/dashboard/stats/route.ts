import { NextRequest, NextResponse } from "next/server";

// Ensure this route is treated as dynamic
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Extract the Authorization header from the incoming request
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
    const response = await fetch(`${backendApiUrl}/admin/dashboard/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward the Authorization header to the backend API
        Authorization: authorization,
      },
    });

    // Forward the response status from the backend
    if (!response.ok) {
      // Attempt to forward the error body from the backend if available
      const errorBody = await response.text();
      console.error(`Backend API error: ${response.status}`, errorBody);
      return NextResponse.json(
        {
          error: `Backend API error: ${
            response.statusText
          } - ${errorBody.substring(0, 100)}`, // Limit error message length
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Forward the successful response body from the backend
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying request to backend:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats via proxy" },
      { status: 500 }
    );
  }
}
