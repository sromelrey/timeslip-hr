import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/products', '/dashboard', '/employee', '/timesheet', '/payroll', '/settings', '/kiosk'];

// Routes only for non-authenticated users
const authRoutes = ['/sign-in'];

// Public routes that don't require authentication
const publicRoutes = ['/debug-auth'];

// Routes restricted to Admin role only
const adminOnlyRoutes = ['/employee', '/payroll', '/settings'];

// Default redirect for each role after login
const roleDefaultRoutes: Record<string, string> = {
  ADMIN: '/dashboard',
  EMPLOYEE: '/kiosk',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has('timeslip_auth');
  const userRole = request.cookies.get('timeslip_role')?.value || 'EMPLOYEE';

  // Temporary debug logging
  console.log('[Middleware]', {
    pathname,
    isAuthenticated,
    userRole,
    allCookies: request.cookies.getAll().map(c => `${c.name}=${c.value}`).join(', ')
  });

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth routes
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const redirectTo = roleDefaultRoutes[userRole] || '/kiosk';
      console.log('[Middleware] Redirecting authenticated user from auth route to:', redirectTo);
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // Redirect unauthenticated users from protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      console.log('[Middleware] Redirecting unauthenticated user to /sign-in');
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Redirect non-admins from admin-only routes
  if (adminOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated && userRole !== 'ADMIN') {
      console.log('[Middleware] Redirecting non-admin from admin route to /kiosk');
      return NextResponse.redirect(new URL('/kiosk', request.url));
    }
  }

  // Redirect Admins away from employee-only routes (Kiosk)
  if (pathname.startsWith('/kiosk')) {
    if (isAuthenticated && userRole === 'ADMIN') {
      console.log('[Middleware] Redirecting Admin from /kiosk to /dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
