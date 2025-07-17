import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Initialize rate limiter
let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.cachedFixedWindow(12, `${24 * 60 * 60}s`),
    ephemeralCache: new Map(),
    analytics: true,
  })
}

// Middleware solo para rate limiting compatible con Edge Runtime
export default async function middleware(req: NextRequest) {
  // Obtener la IP de la cabecera x-forwarded-for o usar localhost
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1"
  const pathname = req.nextUrl.pathname

  // Rate limiting solo para rutas API si Redis está configurado
  if (pathname.startsWith("/api/") && ratelimit) {
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_middleware_${ip}`
    )

    if (!success) {
      return NextResponse.redirect(new URL("/api/blocked", req.url))
    }

    const res = NextResponse.next()
    res.headers.set("X-RateLimit-Limit", limit.toString())
    res.headers.set("X-RateLimit-Remaining", remaining.toString())
    res.headers.set("X-RateLimit-Reset", reset.toString())
    return res
  }

  // Para otras rutas, solo continuar
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Auth protection
    "/admin/:path*",
    "/mi-proyecto/:path*",
    // Rate limiting
    "/api/transcribe",
    "/api/generate"
  ]
}
