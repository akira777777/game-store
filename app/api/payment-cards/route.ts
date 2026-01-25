import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cardType = searchParams.get("cardType")?.trim() || null
    const region = searchParams.get("region")?.trim() || null
    const search = searchParams.get("search")?.trim() || ""
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
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

    // Filter by price range (considering both price and discountPrice)
    if (minPrice || maxPrice) {
      const priceFilter: Prisma.FloatFilter = {}
      if (minPrice) {
        const min = parseFloat(minPrice)
        if (!isNaN(min) && min >= 0) {
          priceFilter.gte = min
        }
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice)
        if (!isNaN(max) && max >= 0) {
          priceFilter.lte = max
        }
      }
      // Apply price filter to both regular price and discount price
      if (Object.keys(priceFilter).length > 0) {
        whereConditions.OR = [
          { price: priceFilter },
          { discountPrice: priceFilter },
        ]
      }
    }

    // Filter by search in title or description
    if (search) {
      const databaseUrl = process.env.DATABASE_URL?.trim() || ''
      const isSQLite = databaseUrl.startsWith('file:')
      const searchCondition = isSQLite
        ? { contains: search }
        : { contains: search, mode: 'insensitive' as const }
      
      // Merge with existing OR conditions if price filter is applied
      const searchOrCondition = [
        {
          title: searchCondition,
        },
        {
          description: searchCondition,
        },
      ]
      
      if (whereConditions.OR) {
        // If price filter OR exists, we need to combine them properly
        // Price filter OR and search OR need to both be satisfied
        const existingOR = whereConditions.OR
        delete whereConditions.OR
        whereConditions.AND = [
          { OR: existingOR },
          { OR: searchOrCondition },
        ]
      } else {
        whereConditions.OR = searchOrCondition
      }
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
    logger.error("Error fetching payment cards:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
