import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const session = (req as any).auth
  const isAdmin = session?.user?.role === "ADMIN"
  const pathname = req.nextUrl.pathname

  // Protect admin routes
  if (pathname.startsWith("/admin") && !isAdmin) {
    // Redirect to home if not admin
    return NextResponse.redirect(new URL("/", req.url))
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

  return response
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
