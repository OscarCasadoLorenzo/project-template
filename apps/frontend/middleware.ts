import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register", "/unauthorized"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For client-side rendered apps with localStorage auth,
  // we handle protection in the AuthProvider and ProtectedRoute components
  // In production with server-side sessions, implement token validation here
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
