import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

// Role type for SQLite (stored as string)
type Role = "CUSTOMER" | "ADMIN"

const gameSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  discountPrice: z.number().positive().optional().nullable(),
  images: z.union([z.array(z.string()), z.string()]).optional(),
  releaseDate: z.string().optional().nullable(),
  developer: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  platforms: z.union([z.array(z.string()), z.string()]).optional(),
  genres: z.union([z.array(z.string()), z.string()]).optional(),
  featured: z.boolean().optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().int().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const game = await db.game.findUnique({
      where: { id: params.id },
    })

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ game })
  } catch (error) {
    console.error("Error fetching game:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = gameSchema.parse(body)

    // Check if game exists
    const existingGame = await db.game.findUnique({
      where: { id: params.id },
    })

    if (!existingGame) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }

    // Check slug uniqueness if slug is being updated
    if (validatedData.slug && validatedData.slug !== existingGame.slug) {
      const slugExists = await db.game.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: "Game with this slug already exists" },
          { status: 400 }
        )
      }
    }

    const updateData: any = { ...validatedData }
    
    if (updateData.images !== undefined) {
      updateData.images = Array.isArray(updateData.images)
        ? JSON.stringify(updateData.images)
        : (typeof updateData.images === 'string' ? updateData.images : '[]')
    }
    
    if (updateData.platforms !== undefined) {
      updateData.platforms = Array.isArray(updateData.platforms)
        ? JSON.stringify(updateData.platforms)
        : updateData.platforms
    }
    
    if (updateData.genres !== undefined) {
      updateData.genres = Array.isArray(updateData.genres)
        ? JSON.stringify(updateData.genres)
        : updateData.genres
    }
    
    if (updateData.releaseDate !== undefined) {
      updateData.releaseDate = updateData.releaseDate
        ? new Date(updateData.releaseDate)
        : null
    }

    const game = await db.game.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ game })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating game:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const game = await db.game.findUnique({
      where: { id: params.id },
    })

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }

    await db.game.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
