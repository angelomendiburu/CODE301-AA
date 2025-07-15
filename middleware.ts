import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow requests to /api/auth, /_next, /static, and image files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)
  ) {
    return NextResponse.next();
  }

  if (token) {
    const userRole = token.role as string;

    if (pathname === "/") {
      if (userRole === "admin" || userRole === "superadmin") {
        return NextResponse.redirect(new URL("/admin/metrics", req.url));
      }
      return NextResponse.redirect(new URL("/mi-proyecto", req.url));
    }

    if (pathname.startsWith("/admin") && userRole !== "admin" && userRole !== "superadmin") {
      return NextResponse.redirect(new URL("/mi-proyecto", req.url));
    }

  } else {
    // Redirect unauthenticated users to the login page, except for the login page itself
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
