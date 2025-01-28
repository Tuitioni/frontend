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
    const apiUrl = `${process.env.TUITIONI_API}/teacher/${params.id}`;
    console.log("Making request to:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    console.log(res);
    return NextResponse.json(res);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch teacher profile",
      },
      { status: 500 }
    );
  }
}
