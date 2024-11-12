import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { firstName, lastName, email, password, location, phone } =
    await request.json();
  console.log(firstName, lastName, email, password, phone);

  const response = await fetch(`${process.env.TUTIONI_API}/teacher/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      location,
      phone,
    }), // Include all registration fields in the body
  });

  const res = await response.json();
  console.log(res);
  return NextResponse.json(res);
}
