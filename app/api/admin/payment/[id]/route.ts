import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// --- Helper Functions (copy from other [id] routes or centralize) ---
function getRequestEssentials(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  const backendApiUrl = process.env.TUITIONI_API;
  return { authorization, backendApiUrl };
}

async function handleBackendResponse(response: Response) {
  if (response.ok && response.status === 204) {
    return new NextResponse(null, { status: 204 }); // Success, no content
  }
  // Try to parse JSON, handle cases where backend might not send JSON on error
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json(
      { error: data.message || `Backend error: ${response.statusText}` },
      { status: response.status }
    );
  }
  // If response is OK but not 204, assume JSON payload
  return NextResponse.json(data);
}
// --- End Helper Functions ---

// DELETE: Delete a payment by ID
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
      { error: "Internal server config error" },
      { status: 500 }
    );
  if (!id)
    return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });

  try {
    const response = await fetch(`${backendApiUrl}/payment/${id}`, {
      method: "DELETE",
      headers: { Authorization: authorization },
    });
    return await handleBackendResponse(response); // Use helper to handle 204 etc.
  } catch (error) {
    console.error(`Error deleting payment ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}

// Optional: Add GET / PUT handlers if a detail/edit page for payments exists or is needed
