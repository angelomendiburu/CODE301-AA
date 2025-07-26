import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const { pathname } = req.nextUrl

  if (token && token.role === "admin") {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin/metrics", req.url))
    }
  }

  if (token && token.role !== "admin") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/mi-proyecto", req.url))
    }
  }

  return NextResponse.next()
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
