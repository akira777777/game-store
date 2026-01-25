import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * GET /api/orders - Get current user's order history
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10))
    const skip = (page - 1) * limit

    // Get orders with items
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              game: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  images: true,
                },
              },
              paymentCard: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  images: true,
                  cardType: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({
        where: { userId: session.user.id },
      }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
