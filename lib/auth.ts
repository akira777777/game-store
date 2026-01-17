import { db } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Role type for SQLite (stored as string)
type Role = "CUSTOMER" | "ADMIN"

export const { handlers, auth, signIn, signOut } = NextAuth({
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
  secret: process.env.NEXTAUTH_SECRET,
})
