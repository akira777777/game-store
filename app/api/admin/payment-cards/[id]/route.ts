import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Force Node.js runtime for SQLite compatibility
export const runtime = 'nodejs';

const paymentCardSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  cardType: z.string().min(1).optional(),
  region: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  denomination: z.number().optional().nullable(),
  price: z.number().positive().optional(),
  discountPrice: z.number().positive().optional().nullable(),
  images: z.union([z.array(z.string()), z.string()]).optional(),
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

    const card = await db.paymentCard.findUnique({
      where: { id: params.id },
    })

    if (!card) {
      return NextResponse.json(
        { error: "Payment card not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ card })
  } catch (error) {
    console.error("Error fetching payment card:", error)
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
    const validatedData = paymentCardSchema.parse(body)

    // Convert images to JSON string if array
    const updateData: any = { ...validatedData }
    if (validatedData.images !== undefined) {
      updateData.images = Array.isArray(validatedData.images)
        ? JSON.stringify(validatedData.images)
        : validatedData.images
    }

    const card = await db.paymentCard.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ card })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error updating payment card:", error)
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

    await db.paymentCard.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting payment card:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
