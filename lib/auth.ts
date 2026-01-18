// Lazy import db to avoid Prisma Client initialization in Edge Runtime (middleware)
// db will only be imported when authorize() is called, which doesn't run in middleware
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Dynamic import for bcryptjs to avoid Edge Runtime issues
// bcryptjs will only be imported when authorize() is called, not during middleware/Edge bundling
let bcrypt: any;

// Role type for SQLite (stored as string)
type Role = "CUSTOMER" | "ADMIN"

// Validate secret before NextAuth initialization
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
if (!authSecret && process.env.NODE_ENV === 'production') {
  throw new Error(
    'Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable. ' +
    'Please set one of these variables in Vercel Environment Variables (Settings → Environment Variables).'
  );
}

let authConfig: any;
try {
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

          // Dynamic import bcryptjs only when needed (not in Edge Runtime)
          if (!bcrypt) {
            bcrypt = (await import("bcryptjs")).default;
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
} catch (error: any) {
  throw error;
}

let nextAuthResult: any;
try {
  nextAuthResult = NextAuth(authConfig);
} catch (error: any) {
  throw error;
}

export const { handlers, auth, signIn, signOut } = nextAuthResult;
