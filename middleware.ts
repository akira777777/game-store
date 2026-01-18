import { NextResponse, type NextRequest } from "next/server";

// Middleware that doesn't depend on auth() to avoid Edge Runtime bundling issues
// Instead of using auth() middleware, we'll implement basic route protection
// and rely on server-side authentication for actual auth checks

export default function middleware(req: NextRequest) {
  // #region agent log
  // Note: Middleware runs in Edge Runtime, so we can't use file I/O here
  // Logging will be done via fetch to the debug endpoint
  fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'middleware.ts:7', message: 'Middleware entry', data: { pathname: req.nextUrl.pathname, method: req.method }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'J' }) }).catch(() => { });
  // #endregion

  const response = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Only set Strict-Transport-Security in production with HTTPS
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'middleware.ts:28', message: 'Middleware exit', data: { pathname, headersSet: true }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'J' }) }).catch(() => { });
  // #endregion

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
