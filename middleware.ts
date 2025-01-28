import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isLogoutPage = request.nextUrl.pathname.startsWith('/api/auth/logout');

  // Allow logout requests to proceed
  if (isLogoutPage) {
    return NextResponse.next();
  }

  if (!token && !isAuthPage) {
    // Redirect to login if accessing protected route without token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    // Redirect to dashboard if accessing auth pages with token
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/register',
    '/api/auth/logout'
  ]
}; 