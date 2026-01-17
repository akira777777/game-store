import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { formatErrorResponse, ValidationError, ConflictError, DatabaseError } from "@/lib/errors"

const registerSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password must be at most 128 characters"),
  name: z.string().min(1).max(100).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Normalize email to lowercase for case-insensitive comparison
    const normalizedEmail = validatedData.email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      throw new ConflictError("User with this email already exists")
    }

    // Hash password with proper salt rounds
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds)

    // Create user with normalized email
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: validatedData.name?.trim() || null,
      },
    })

    // Don't return password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        formatErrorResponse(new ValidationError("Validation failed", error.errors)),
        { status: 400 }
      )
    }

<<<<<<< Current (Your changes)
    if (error instanceof ConflictError || error instanceof ValidationError) {
      return NextResponse.json(formatErrorResponse(error), { status: error.statusCode })
    }

    // Check for Prisma unique constraint violations
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        formatErrorResponse(new ConflictError("User with this email already exists")),
        { status: 409 }
      )
    }

    console.error("Registration error:", error)
=======
    logger.error("Registration error", error, { email: validatedData.email })
>>>>>>> Incoming (Background Agent changes)
    return NextResponse.json(
      formatErrorResponse(new DatabaseError("Failed to create user", error)),
      { status: 500 }
    )
  }
}
