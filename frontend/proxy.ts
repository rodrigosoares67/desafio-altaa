import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/assets')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('Authentication')?.value;

  const publicRoutes = ['/login', '/signup', '/accept-invite', '/'];
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith('/accept-invite'),
  );

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicRoute && token && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*(?<!\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|txt|xml|json)))'],
};
