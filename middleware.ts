import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

/** Reads the role from a JWT without verifying it (routing only; the API verifies). */
function roleOf(token: string | undefined): 'student' | 'teacher' | 'admin' | null {
  if (!token) return null;
  try {
    return jwtDecode<{ role?: 'student' | 'teacher' | 'admin' }>(token).role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Two parallel sessions: teachers/students use `access_token`, admins use
  // `admin_token`. The user token's role decides student vs teacher routing.
  const userToken = request.cookies.get('access_token')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;
  const role = roleOf(userToken);
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin-dashboard');
  const isTeacherRoute = pathname.startsWith('/dashboard');
  const isStudentRoute = pathname.startsWith('/student-dashboard');
  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/signin';
  const isLogoutPage = pathname.startsWith('/api/auth/logout');
  const isProtectedRoute =
    isAdminRoute || isTeacherRoute || isStudentRoute || pathname.startsWith('/profile');

  const userHome = role === 'student' ? '/student-dashboard' : '/dashboard';

  if (isLogoutPage) {
    return NextResponse.next();
  }

  // Admin area requires the admin session specifically.
  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Teacher/student areas require a user session.
  if ((isTeacherRoute || isStudentRoute || pathname.startsWith('/profile')) && !userToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Keep each role in its own area.
  if (isTeacherRoute && role === 'student') {
    return NextResponse.redirect(new URL('/student-dashboard', request.url));
  }
  if (isStudentRoute && role === 'teacher') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Already signed in: send each session type to its own home.
  if (isAuthPage && (userToken || adminToken)) {
    const home = adminToken ? '/admin-dashboard' : userHome;
    return NextResponse.redirect(new URL(home, request.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-Request-Id', crypto.randomUUID());
  return response;
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/student-dashboard/:path*',
    '/login',
    '/register',
    '/signin',
    '/api/auth/logout',
  ],
};
