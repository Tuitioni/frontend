import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = await fetch(`${process.env.TUITIONI_API}/teacher`, {
    method: "GET",
  });

  const res = await response.json();
  return NextResponse.json(res);
}
