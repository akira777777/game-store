import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Role type for SQLite (stored as string)
type Role = "CUSTOMER" | "ADMIN"

// #region agent log
// Validate secret before NextAuth initialization
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
if (typeof console !== 'undefined' && console.log) {
  console.log('[Auth] Initialization check:', {
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasSecret: !!authSecret,
    nodeEnv: process.env.NODE_ENV,
    trustHost: true
  });
}
if (!authSecret && process.env.NODE_ENV === 'production') {
  const error = new Error(
    'Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable. ' +
    'Please set one of these variables in Vercel Environment Variables (Settings → Environment Variables).'
  );
  if (typeof console !== 'undefined' && console.error) {
    console.error('[Auth] Fatal error:', error.message);
  }
  throw error;
}
// #endregion

// #region agent log
// Wrap NextAuth initialization in try-catch for better error reporting
let authConfig: any;
try {
  authConfig = {
  // PrismaAdapter type compatibility issue - adapter is optional when using credentials
  // adapter: PrismaAdapter(db) as any,
  trustHost: true, // Required for middleware to work in production (Vercel, etc.)
  // #region agent log
  // Log auth config initialization
  // #endregion
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // User interface extends with role property via module declaration
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
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
  if (typeof console !== 'undefined' && console.log) {
    console.log('[Auth] Config created successfully');
  }
} catch (error) {
  if (typeof console !== 'undefined' && console.error) {
    console.error('[Auth] Config creation error:', error);
  }
  throw error;
}

let nextAuthResult;
try {
  nextAuthResult = NextAuth(authConfig);
  if (typeof console !== 'undefined' && console.log) {
    console.log('[Auth] NextAuth initialized successfully');
  }
} catch (error) {
  if (typeof console !== 'undefined' && console.error) {
    console.error('[Auth] NextAuth initialization error:', error);
  }
  throw error;
}

export const { handlers, auth, signIn, signOut } = nextAuthResult;
// #endregion
