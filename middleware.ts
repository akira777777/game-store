import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// #region agent log
// Check if secret is available before middleware initialization
const hasSecret = !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
if (!hasSecret && typeof console !== 'undefined' && console.error) {
  console.error('[Middleware] AUTH_SECRET or NEXTAUTH_SECRET is missing. Middleware may fail.');
}
// #endregion

export default auth((req) => {
  // #region agent log
  // Log to console for Vercel Edge Runtime (fetch to localhost doesn't work in Edge)
  if (typeof console !== 'undefined' && console.log) {
    console.log('[Middleware] Entry:', {
      pathname: req.nextUrl.pathname,
      hasAuth: !!req.auth,
      hasSecret: !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET)
    });
  }
  // #endregion
  
  const session = req.auth;
  // #region agent log
  if (typeof console !== 'undefined' && console.log) {
    console.log('[Middleware] Session:', {
      exists: !!session,
      hasUser: !!session?.user,
      role: session?.user?.role
    });
  }
  // #endregion
  
  const isAdmin = session?.user?.role === "ADMIN"
  const pathname = req.nextUrl.pathname

  // Protect admin routes
  if (pathname.startsWith("/admin") && !isAdmin) {
    // #region agent log
    if (typeof console !== 'undefined' && console.log) {
      console.log('[Middleware] Admin route protection:', { pathname, isAdmin });
    }
    // #endregion
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Add security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Only set Strict-Transport-Security in production with HTTPS
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    )
  }

  // #region agent log
  if (typeof console !== 'undefined' && console.log) {
    console.log('[Middleware] Completion:', { pathname });
  }
  // #endregion
  return response
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
