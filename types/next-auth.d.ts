import NextAuth from "next-auth"

// Role type for SQLite (stored as string)
type Role = "CUSTOMER" | "ADMIN"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: Role
    }
  }

  interface User {
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
  }
}
