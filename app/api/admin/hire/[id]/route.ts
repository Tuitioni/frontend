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
  // Handle successful empty responses (e.g., 204 No Content for DELETE)
  if (response.ok && response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.json().catch(() => ({})); // Attempt to parse JSON, default to empty obj on error

  if (!response.ok) {
    return NextResponse.json(
      { error: data.message || `Backend error: ${response.statusText}` },
      { status: response.status }
    );
  }
  return NextResponse.json(data);
}

// GET: Fetch a single hire by ID
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
    return NextResponse.json({ error: "Missing hire ID" }, { status: 400 });

  try {
    const response = await fetch(`${backendApiUrl}/hire/${id}`, {
      method: "GET",
      headers: { Authorization: authorization },
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error(`Error fetching hire ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch hire" },
      { status: 500 }
    );
  }
}

// PUT: Update a hire by ID
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
    return NextResponse.json({ error: "Missing hire ID" }, { status: 400 });

  try {
    const body = await request.json();
    const response = await fetch(`${backendApiUrl}/hire/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error(`Error updating hire ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update hire" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a hire by ID
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
    return NextResponse.json({ error: "Missing hire ID" }, { status: 400 });

  try {
    const response = await fetch(`${backendApiUrl}/hire/${id}`, {
      method: "DELETE",
      headers: { Authorization: authorization },
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error(`Error deleting hire ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete hire" },
      { status: 500 }
    );
  }
}
