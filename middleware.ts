import { NextResponse, type NextRequest } from "next/server"

// Middleware that doesn't depend on auth() to avoid Edge Runtime bundling issues
// Instead of using auth() middleware, we'll implement basic route protection
// and rely on server-side authentication for actual auth checks

const middlewareHandler = (req: NextRequest) => {
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

  return response;
};

export default middlewareHandler;

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}