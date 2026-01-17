// #region agent log
// Logging utility - defined at module level for use throughout
const logEndpoint = 'http://127.0.0.1:7243/ingest/52759509-b965-4546-8bf0-8fc4be97e169';
const logToFile = (location: string, message: string, data: any, hypothesisId?: string) => {
  if (typeof fetch !== 'undefined') {
    fetch(logEndpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId})}).catch(()=>{});
  }
  if (typeof console !== 'undefined' && console.log) {
    console.log(`[Auth] ${message}`, data);
  }
};
// Log module import to track initialization order
logToFile('lib/auth.ts:3', 'Module loading started', {}, 'H4');
// #endregion

// Lazy import db to avoid Prisma Client initialization in Edge Runtime (middleware)
// db will only be imported when authorize() is called, which doesn't run in middleware
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// #region agent log
logToFile('lib/auth.ts:16', 'Core dependencies loaded', {deps:['bcrypt','NextAuth','CredentialsProvider']}, 'H4');
// #endregion

// Role type for SQLite (stored as string)
type Role = "CUSTOMER" | "ADMIN"

// #region agent log
// Validate secret before NextAuth initialization
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
const secretCheck = {
  hasAuthSecret: !!process.env.AUTH_SECRET,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasSecret: !!authSecret,
  nodeEnv: process.env.NODE_ENV,
  trustHost: true
};
logToFile('lib/auth.ts:25', 'Initialization check - BEFORE validation', secretCheck, 'H5');
if (!authSecret && process.env.NODE_ENV === 'production') {
  const error = new Error(
    'Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable. ' +
    'Please set one of these variables in Vercel Environment Variables (Settings → Environment Variables).'
  );
  logToFile('lib/auth.ts:35', 'Fatal error - missing secret', {error:error.message}, 'H5');
  throw error;
}
logToFile('lib/auth.ts:44', 'Initialization check - AFTER validation', {hasSecret:!!authSecret}, 'H5');
// #endregion

// #region agent log
// Log auth config initialization attempt
logToFile('lib/auth.ts:50', 'Starting NextAuth initialization - BEFORE config creation', {}, 'H1');

let authConfig: any;
try {
  logToFile('lib/auth.ts:54', 'BEFORE authConfig creation', {authSecret:!!authSecret}, 'H1');
  authConfig = {
    // PrismaAdapter type compatibility issue - adapter is optional when using credentials
    // adapter: PrismaAdapter(db) as any,
    trustHost: true, // Required for middleware to work in production (Vercel, etc.)
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          // #region agent log
          if (typeof console !== 'undefined' && console.log) {
            console.log('[Auth] authorize() called - lazy loading db');
          }
          // #endregion
          
          // Lazy import db only when authorize() is called (not in middleware/Edge Runtime)
          const { db } = await import("@/lib/db");
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Invalid credentials")
          }

          // Normalize email to lowercase for case-insensitive comparison
          const email = (credentials.email as string).toLowerCase().trim()
          const password = credentials.password as string

          const user = await db.user.findUnique({
            where: {
              email: email,
            },
          })

          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as Role,
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }: { token: any; user?: any }) {
        if (user) {
          token.id = user.id
          // User interface extends with role property via module declaration
          token.role = user.role
        }
        return token
      },
      async session({ session, token }: { session: any; token: any }) {
        if (session.user) {
          session.user.id = token.id as string
          session.user.role = (token.role as Role) || "CUSTOMER"
        }
        return session
      },
    },
    // Support both AUTH_SECRET (preferred in v5) and NEXTAUTH_SECRET (legacy)
    secret: authSecret,
  };
  logToFile('lib/auth.ts:137', 'AFTER authConfig creation - config object created', {hasProviders:!!authConfig.providers,hasCallbacks:!!authConfig.callbacks,hasSecret:!!authConfig.secret}, 'H1');
} catch (error: any) {
  logToFile('lib/auth.ts:142', 'Config creation error', {error:error?.message,stack:error?.stack}, 'H1');
  throw error;
}

let nextAuthResult: any;
try {
  logToFile('lib/auth.ts:150', 'BEFORE NextAuth() call', {hasAuthConfig:!!authConfig}, 'H2');
  nextAuthResult = NextAuth(authConfig);
  logToFile('lib/auth.ts:151', 'AFTER NextAuth() call - success', {hasHandlers:!!nextAuthResult?.handlers,hasAuth:!!nextAuthResult?.auth}, 'H2');
} catch (error: any) {
  logToFile('lib/auth.ts:156', 'NextAuth initialization error', {error:error?.message,stack:error?.stack}, 'H2');
  throw error;
}

logToFile('lib/auth.ts:163', 'BEFORE export destructuring', {hasNextAuthResult:!!nextAuthResult}, 'H3');
export const { handlers, auth, signIn, signOut } = nextAuthResult;
logToFile('lib/auth.ts:163', 'AFTER export destructuring', {hasAuth:!!auth,hasHandlers:!!handlers}, 'H3');
// #endregion
