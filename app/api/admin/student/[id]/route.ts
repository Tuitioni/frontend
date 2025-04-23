import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// --- Helper Functions (identical to teacher route) ---
function getRequestEssentials(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  const backendApiUrl = process.env.TUITIONI_API;
  return { authorization, backendApiUrl };
}

async function handleBackendResponse(response: Response) {
  if (response.ok && response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json(
      { error: data.message || `Backend error: ${response.statusText}` },
      { status: response.status }
    );
  }
  return NextResponse.json(data);
}
// --- End Helper Functions ---

// GET: Fetch a single student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorization, backendApiUrl } = getRequestEssentials(request);
  const { id } = params;

  if (!authorization)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!backendApiUrl)
    return NextResponse.json(
      { error: "Internal server configuration error" },
      { status: 500 }
    );
  if (!id)
    return NextResponse.json({ error: "Missing student ID" }, { status: 400 });

  try {
    const response = await fetch(`${backendApiUrl}/student/${id}`, {
      method: "GET",
      headers: { Authorization: authorization },
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

// PUT: Update a student by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorization, backendApiUrl } = getRequestEssentials(request);
  const { id } = params;

  if (!authorization)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!backendApiUrl)
    return NextResponse.json(
      { error: "Internal server configuration error" },
      { status: 500 }
    );
  if (!id)
    return NextResponse.json({ error: "Missing student ID" }, { status: 400 });

  try {
    const body = await request.json();
    const response = await fetch(`${backendApiUrl}/student/${id}`, {
      method: "PUT", // Using PUT as per user's last change
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a student by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorization, backendApiUrl } = getRequestEssentials(request);
  const { id } = params;

  if (!authorization)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!backendApiUrl)
    return NextResponse.json(
      { error: "Internal server configuration error" },
      { status: 500 }
    );
  if (!id)
    return NextResponse.json({ error: "Missing student ID" }, { status: 400 });

  try {
    const response = await fetch(`${backendApiUrl}/student/${id}`, {
      method: "DELETE",
      headers: { Authorization: authorization },
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
