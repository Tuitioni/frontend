import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string, type: string } }
) {
  const { id, type } = params;

  console.log(params);

  // Ensure the verification type is in uppercase
  const verificationType = type.toUpperCase();

  // Check if ID and type are provided in the params
  if (!id || !type) {
    return NextResponse.json(
      { error: "Teacher ID and verification type are required" },
      { status: 400 }
    );
  }

  try {
    // Retrieve the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Access token missing" },
        { status: 401 }
      );
    }

    // Get the request body (for file upload)
    const formData = new FormData();
    const body = await request.formData();
    
    // Ensure the 'file' field is not null before appending to FormData
    const file = body.get("file");
    if (file) {
      formData.append("file", file);
    } else {
      return NextResponse.json(
        { error: "File is required for verification" },
        { status: 400 }
      );
    }

    // Make the request to the external API for verification
    const response = await fetch(
      `${process.env.TUTIONI_API}/teacher/${id}/verify/${verificationType}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Failed to verify ${verificationType}: ${errorData?.message || "Unknown error"}` },
        { status: response.status }
      );
    }

    // If everything is successful, return the response from the API
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error verifying ${verificationType}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
