import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect from "/" to "/home"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Redirect from "/profile" to "/dashboard"
  if (pathname === "/profile") {
    return NextResponse.redirect(new URL("/profile/dashboard", request.url));
  }

  // Continue with the request if no redirection is needed
  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: ["/", "/profile"], // Middleware will run on both "/" and "/profile"
};
