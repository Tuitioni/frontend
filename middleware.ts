// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the request is for the root path
  if (request.nextUrl.pathname === "/") {
    // Redirect to /home
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: "/",
};
