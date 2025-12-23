import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/products', '/home', '/dashboard', '/employees', '/timesheets', '/payroll', '/settings'];

// Routes only for non-authenticated users
const authRoutes = ['/sign-in'];

// Routes restricted to Admin role only
const adminOnlyRoutes = ['/employees', '/payroll', '/settings'];

// Default redirect for each role after login
const roleDefaultRoutes: Record<string, string> = {
  ADMIN: '/dashboard',
  EMPLOYEE: '/home',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth and role cookies
  const isAuthenticated = request.cookies.has('auth');
  const userRole = request.cookies.get('role')?.value || 'EMPLOYEE';

  // Redirect authenticated users away from auth routes
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const redirectTo = roleDefaultRoutes[userRole] || '/home';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // Redirect unauthenticated users from protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Redirect non-admins from admin-only routes
  if (adminOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
