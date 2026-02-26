import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token') || request.cookies.get('admin_token');
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

  // Redirect to login if accessing protected route without token
  if (!token && isProtectedRoute) {
    const loginUrl = isAdminRoute ? '/signin' : '/login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  // Redirect to dashboard if accessing auth pages with token
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/admin-dashboard', request.url));
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
