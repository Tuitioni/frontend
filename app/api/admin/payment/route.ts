import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper function (could be shared across routes)
function getRequestEssentials(request: NextRequest) {
  const authorization = request.headers.get("Authorization");
  const backendApiUrl = process.env.TUITIONI_API;
  return { authorization, backendApiUrl };
}

async function handleBackendResponse(response: Response) {
  // For POST, backend might return 201 Created with the new resource
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json().catch(() => ({})) : {};

  if (!response.ok) {
    return NextResponse.json(
      { error: data.message || `Backend error: ${response.statusText}` },
      { status: response.status }
    );
  }
  // Return data (e.g., list for GET, created object for POST)
  // Handle 204 No Content specifically if needed for other methods
  return NextResponse.json(data, { status: response.status });
}

// --- Route Handlers ---

// GET: Fetch list of payments
export async function GET(request: NextRequest) {
  const { authorization, backendApiUrl } = getRequestEssentials(request);

  if (!authorization)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!backendApiUrl)
    return NextResponse.json(
      { error: "Internal server config error" },
      { status: 500 }
    );

  try {
    const response = await fetch(`${backendApiUrl}/payment`, {
      method: "GET",
      headers: { Authorization: authorization },
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST: Create a new payment
export async function POST(request: NextRequest) {
  const { authorization, backendApiUrl } = getRequestEssentials(request);

  if (!authorization)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!backendApiUrl)
    return NextResponse.json(
      { error: "Internal server config error" },
      { status: 500 }
    );

  try {
    const body = await request.json();
    const response = await fetch(`${backendApiUrl}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });
    return await handleBackendResponse(response);
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
