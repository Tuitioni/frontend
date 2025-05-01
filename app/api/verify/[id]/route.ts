import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const { id } = params;

    const response = await fetch(
      `${process.env.TUITIONI_API}/teacher/${id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();
    console.log("Verification Response:", responseData);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to verify teacher" },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error verifying teacher:", error);
    return NextResponse.json(
      { error: "Failed to verify teacher" },
      { status: 500 }
    );
  }
}
