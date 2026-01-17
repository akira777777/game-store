import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { z } from "zod"

const gameSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional().nullable(),
  images: z.union([z.array(z.string()), z.string()]).optional().default([]),
  releaseDate: z.string().optional().nullable(),
  developer: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  platforms: z.union([z.array(z.string()), z.string()]),
  genres: z.union([z.array(z.string()), z.string()]),
  featured: z.boolean().optional().default(false),
  inStock: z.boolean().optional().default(true),
  stockQuantity: z.number().int().optional().default(0),
})

export async function POST(request: NextRequest) {
  let session = null
  let validatedData: z.infer<typeof gameSchema> | null = null
  try {
    session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    validatedData = gameSchema.parse(body)

    // Check if slug already exists
    const existingGame = await db.game.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingGame) {
      return NextResponse.json(
        { error: "Game with this slug already exists" },
        { status: 400 }
      )
    }

    const game = await db.game.create({
      data: {
        ...validatedData,
        images: Array.isArray(validatedData.images)
          ? JSON.stringify(validatedData.images)
          : (typeof validatedData.images === 'string' ? validatedData.images : '[]'),
        platforms: Array.isArray(validatedData.platforms)
          ? JSON.stringify(validatedData.platforms)
          : validatedData.platforms,
        genres: Array.isArray(validatedData.genres)
          ? JSON.stringify(validatedData.genres)
          : validatedData.genres,
        releaseDate: validatedData.releaseDate
          ? new Date(validatedData.releaseDate)
          : null,
      },
    })

    return NextResponse.json({ game }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    logger.error("Error creating game", error, {
      userId: session?.user?.id,
      slug: validatedData?.slug,
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
