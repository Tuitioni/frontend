import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure dynamic handling

// Helper function to get backend URL and Authorization header
function getRequestEssentials(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  const backendApiUrl = process.env.TUITIONI_API;
  return { authorization, backendApiUrl };
}

// Helper function to handle backend responses
async function handleBackendResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(
      { error: data.message || `Backend error: ${response.statusText}` },
      { status: response.status }
    );
  }
  return NextResponse.json(data);
}

// GET: Fetch a single teacher by ID
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
    return NextResponse.json({ error: "Missing teacher ID" }, { status: 400 });

  try {
    const response = await fetch(`${backendApiUrl}/teacher/${id}`, {
      method: "GET",
      headers: { Authorization: authorization },
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error(`Error fetching teacher ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch teacher" },
      { status: 500 }
    );
  }
}

// PUT: Update a teacher by ID
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
    return NextResponse.json({ error: "Missing teacher ID" }, { status: 400 });

  try {
    const body = await request.json();
    const response = await fetch(`${backendApiUrl}/teacher/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error(`Error updating teacher ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a teacher by ID
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
    return NextResponse.json({ error: "Missing teacher ID" }, { status: 400 });

  try {
    const response = await fetch(`${backendApiUrl}/teacher/${id}`, {
      method: "DELETE",
      headers: { Authorization: authorization },
    });

    // Handle potential 204 No Content or other success statuses appropriately
    if (!response.ok) {
      const data = await response.json().catch(() => ({})); // Attempt to get error message
      return NextResponse.json(
        {
          error:
            data.message || `Failed to delete teacher: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    // Return success, potentially with no body if backend sends 204
    return new NextResponse(null, { status: response.status });
  } catch (error) {
    console.error(`Error deleting teacher ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
