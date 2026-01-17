import { auth } from "@/lib/auth"
import { NextResponse, type NextRequest } from "next/server"

// Wrap auth() in try-catch for Edge Runtime error handling
let middlewareHandler: any;
try {
  middlewareHandler = auth((req: NextRequest & { auth?: any }) => {
    const session = req.auth;
    const isAdmin = session?.user?.role === "ADMIN";
    const pathname = req.nextUrl.pathname;

    // Protect admin routes
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Add security headers
    const response = NextResponse.next();

    // Security headers
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
  });
} catch (error: any) {
  // Fallback middleware that just passes through with security headers
  middlewareHandler = (req: NextRequest) => {
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  };
}

export default middlewareHandler;

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
