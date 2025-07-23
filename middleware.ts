
// Middleware deshabilitado para exposición - Sin restricciones de acceso
// Todas las rutas son accesibles directamente sin validaciones

export default function middleware() {
  // No aplica ninguna restricción - permite el paso libre a todas las rutas
  return;
}

// Configuración opcional: aplicar a todas las rutas pero sin hacer nada
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
