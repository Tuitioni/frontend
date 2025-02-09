import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const body = await request.json();
    console.log(body);

    // Fetch data from the external API
    const response = await fetch(`${process.env.TUITIONI_API}/hire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the token to the external API if needed
      },
      body: JSON.stringify(body),
    });

    console.log(response);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to hire" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error hiring data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
