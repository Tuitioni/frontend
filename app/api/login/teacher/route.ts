import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Parse the JSON body from the incoming request
  const { username: identifier, password } = await request.json();
  console.log(identifier, password);

  const response = await fetch(
    `${process.env.TUTIONI_API}/auth/login/teacher`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type
      },
      body: JSON.stringify({ identifier, password }), // Include username and password in the body
    }
  );

  const res = await response.json();
  console.log(res);
  return NextResponse.json(res);
}
