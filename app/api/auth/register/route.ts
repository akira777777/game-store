import { db } from "@/lib/db"
import { ConflictError, DatabaseError, formatErrorResponse, ValidationError } from "@/lib/errors"
import { logger } from "@/lib/logger"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
    ),
  name: z.string().min(1).max(100).optional(),
})

export async function POST(request: NextRequest) {
  let validatedData: z.infer<typeof registerSchema> | null = null
  try {
    const body = await request.json()
    validatedData = registerSchema.parse(body)

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

    logger.error("Registration error", error, { email: validatedData?.email })
    return NextResponse.json(
      formatErrorResponse(new DatabaseError("Failed to create user", error)),
      { status: 500 }
    )
  }
}
