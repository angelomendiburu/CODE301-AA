import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Si no hay token y la ruta no es la de inicio de sesión, redirigir a inicio de sesión
  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Si hay token
  if (token) {
    // Si el usuario es admin
    if (token.role === "admin") {
      // Si está en la página de inicio, redirigir a /admin/metrics
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/admin/metrics", req.url))
      }
    }
    // Si el usuario no es admin
    else {
      // Si intenta acceder a una ruta de admin, redirigir a /mi-proyecto
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/mi-proyecto", req.url))
      }
      // Si está en la página de inicio, redirigir a /mi-proyecto
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/mi-proyecto", req.url))
      }
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
