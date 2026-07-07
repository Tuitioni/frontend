import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Two parallel sessions exist: teachers/students use `access_token`,
  // admins use `admin_token`. Route by which one is present.
  const userToken = request.cookies.get('access_token');
  const adminToken = request.cookies.get('admin_token');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin-dashboard');
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname === '/signin';
  const isLogoutPage = request.nextUrl.pathname.startsWith('/api/auth/logout');
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/admin-dashboard') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/dashboard');

  // Allow logout requests to proceed
  if (isLogoutPage) {
    return NextResponse.next();
  }

  // Admin area requires the admin session specifically.
  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Other protected routes require either session.
  if (!userToken && !adminToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Already signed in: send each session type to its own home.
  if (isAuthPage && (userToken || adminToken)) {
    const home = adminToken ? '/admin-dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(home, request.url));
  }

  const response = NextResponse.next();

  // Add request ID for tracing
  response.headers.set('X-Request-Id', crypto.randomUUID());

  return response;
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
    '/signin',
    '/api/auth/logout',
  ],
};
