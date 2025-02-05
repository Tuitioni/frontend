import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("Auth header:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const apiUrl = `${process.env.TUITIONI_API}/student/${params.id}`;
    console.log("Making request to:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    // If backend returns 401, return it to trigger client-side redirect
    if (response.status === 401 || responseData.statusCode === 401) {
      return NextResponse.json(
        { error: "Unauthorized - Session expired" },
        { status: 401 }
      );
    }

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch profile");
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch student profile",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("PUT request received for ID:", params.id);

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("Authorization header missing or invalid");
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const body = await request.json();
    console.log("Request body:", body);

    const apiUrl = `${process.env.TUITIONI_API}/student/${params.id}`;
    console.log("Making request to backend:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    // If backend returns 401, return it to trigger client-side redirect
    if (response.status === 401 || responseData.statusCode === 401) {
      return NextResponse.json(
        { error: "Unauthorized - Session expired" },
        { status: 401 }
      );
    }

    if (!response.ok) {
      console.error("Backend error:", responseData);
      return NextResponse.json(
        { error: responseData.message || "Failed to update profile" },
        { status: response.status }
      );
    }

    console.log("Update successful:", responseData);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      },
      { status: 500 }
    );
  }
}
