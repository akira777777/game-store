import { auth } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"

// #region agent log
const logEndpoint = 'http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169';
const logToFile = (location: string, message: string, data: any, hypothesisId?: string) => {
  if (typeof fetch !== 'undefined') {
    fetch(logEndpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId})}).catch(()=>{});
  }
  if (typeof console !== 'undefined' && console.log) {
    console.log(`[Middleware] ${message}`, data);
  }
};
// Log middleware module loading - if this executes, module loaded successfully
logToFile('middleware.ts:7', 'Module loaded successfully', {}, 'H4');
// Check if secret is available before middleware initialization
const hasSecret = !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
logToFile('middleware.ts:10', 'Secret check', { hasSecret }, 'H5');
if (!hasSecret && typeof console !== 'undefined' && console.error) {
  console.error('[Middleware] AUTH_SECRET or NEXTAUTH_SECRET is missing. Middleware may fail.');
}
logToFile('middleware.ts:18', 'BEFORE importing auth', {}, 'H4');
// #endregion

// Wrap auth() in try-catch for Edge Runtime error handling
let middlewareHandler: any;
try {
  middlewareHandler = auth((req: NextRequest & { auth?: any }) => {
  // #region agent log
  // Log to console for Vercel Edge Runtime (fetch to localhost doesn't work in Edge)
  logToFile('middleware.ts:20', 'Middleware Entry', {
    pathname: req.nextUrl.pathname,
    hasAuth: !!req.auth,
    hasSecret: !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET)
  }, 'H3');
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
  });
  logToFile('middleware.ts:82', 'auth() wrapper created successfully', {}, 'H3');
} catch (error: any) {
  logToFile('middleware.ts:85', 'auth() wrapper creation error', {error:error?.message,stack:error?.stack}, 'H3');
  // Fallback middleware that just passes through
  middlewareHandler = (req: NextRequest) => {
    logToFile('middleware.ts:87', 'Fallback middleware - auth() failed', {pathname:req.nextUrl.pathname}, 'H3');
    return NextResponse.next();
  };
}

export default middlewareHandler;

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
