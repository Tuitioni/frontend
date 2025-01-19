import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve the token from cookies
  const token = request.cookies.get("access_token");

  if (pathname.startsWith("/profile")) {
    if (!token) {
      // Redirect to login if token is missing
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Allow access to the profile/dashboard if the token exists
    if (pathname === "/profile") {
      return NextResponse.redirect(new URL("/profile/dashboard", request.url));
    }
  }

  // Default redirect for root path
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Continue processing if no redirection is needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile/:path*"],
};
