import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cardType = searchParams.get("cardType")?.trim() || null
    const region = searchParams.get("region")?.trim() || null
    const search = searchParams.get("search")?.trim() || ""
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12", 10) || 12))
    const skip = (page - 1) * limit

    const whereConditions: Prisma.PaymentCardWhereInput = {
      inStock: true,
    }

    // Filter by card type
    if (cardType) {
      whereConditions.cardType = cardType
    }

    // Filter by region
    if (region) {
      whereConditions.region = region
    }

    // Filter by search in title or description
    if (search) {
      const databaseUrl = process.env.DATABASE_URL?.trim() || ''
      const isSQLite = databaseUrl.startsWith('file:')
      const searchCondition = isSQLite
        ? { contains: search }
        : { contains: search, mode: 'insensitive' as const }
      
      whereConditions.OR = [
        {
          title: searchCondition,
        },
        {
          description: searchCondition,
        },
      ]
    }

    const [cards, total] = await Promise.all([
      db.paymentCard.findMany({
        where: whereConditions,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.paymentCard.count({
        where: whereConditions,
      }),
    ])

    return NextResponse.json({
      cards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching payment cards:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
