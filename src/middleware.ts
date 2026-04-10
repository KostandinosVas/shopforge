import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect /account routes
  if (pathname.startsWith('/account')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};