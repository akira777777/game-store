import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:5',message:'Middleware entry',data:{pathname:req.nextUrl.pathname,url:req.url,hasAuth:!!req.auth,envSecret:!!process.env.NEXTAUTH_SECRET},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  let session;
  try {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:12',message:'Before req.auth access',data:{reqAuthType:typeof req.auth},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    session = req.auth;
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:16',message:'After req.auth access',data:{sessionExists:!!session,hasUser:!!session?.user,userRole:session?.user?.role},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:20',message:'Error accessing req.auth',data:{error:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    throw error;
  }
  
  const isAdmin = session?.user?.role === "ADMIN"
  const pathname = req.nextUrl.pathname

  // Protect admin routes
  if (pathname.startsWith("/admin") && !isAdmin) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:30',message:'Admin route protection - redirecting',data:{pathname,isAdmin,url:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    try {
      const redirectUrl = new URL("/", req.url);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:34',message:'URL created successfully',data:{redirectUrl:redirectUrl.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return NextResponse.redirect(redirectUrl);
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:38',message:'Error creating redirect URL',data:{error:error instanceof Error?error.message:String(error),reqUrl:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      throw error;
    }
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
  fetch('http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:49',message:'Middleware completion - returning response',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  return response
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
