import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { body } = await request.json();
  const token = request.headers.get("Authorization")?.split(" ")[1];

  const response = await fetch(`${process.env.TUITIONI_API}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
