import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

// Constants for input validation
const MAX_LIMIT = 100
const DEFAULT_LIMIT = 12
const MIN_PAGE = 1
const VALID_SORT_FIELDS = ['createdAt', 'price', 'title', 'updatedAt'] as const
const VALID_ORDER = ['asc', 'desc'] as const

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const genre = searchParams.get("genre")?.trim() || null
    const platform = searchParams.get("platform")?.trim() || null
    const search = searchParams.get("search")?.trim() || ""
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const page = Math.max(MIN_PAGE, parseInt(searchParams.get("page") || "1", 10) || MIN_PAGE)
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT))
    const sortByParam = searchParams.get("sortBy") || "createdAt"
    const sortBy = VALID_SORT_FIELDS.includes(sortByParam as typeof VALID_SORT_FIELDS[number])
      ? sortByParam as typeof VALID_SORT_FIELDS[number]
      : "createdAt"
    const orderParam = searchParams.get("order") || "desc"
    const order = VALID_ORDER.includes(orderParam.toLowerCase() as typeof VALID_ORDER[number])
      ? (orderParam.toLowerCase() as typeof VALID_ORDER[number])
      : "desc"

    const skip = (page - 1) * limit

    // Build where clause for PostgreSQL JSON queries
    const whereConditions: Prisma.GameWhereInput = {
      inStock: true,
    }

    // Filter by genre using PostgreSQL JSON contains
    if (genre) {
      whereConditions.genres = {
        contains: `"${genre}"`,
      }
    }

    // Filter by platform using PostgreSQL JSON contains
    if (platform) {
      whereConditions.platforms = {
        contains: `"${platform}"`,
      }
    }

    // Filter by search in title or description
    if (search) {
      whereConditions.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ]
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
      
      // Apply price filter to either price or discountPrice (whichever is applicable)
      if (Object.keys(priceFilter).length > 0) {
        const existingAnd = whereConditions.AND
        const andArray = Array.isArray(existingAnd) ? existingAnd : existingAnd ? [existingAnd] : []
        whereConditions.AND = [
          ...andArray,
          {
            OR: [
              { price: priceFilter },
              { discountPrice: priceFilter },
            ],
          },
        ]
      }
    }

    // Execute query with filters applied at database level
    const [games, total] = await Promise.all([
      db.game.findMany({
        where: whereConditions,
        orderBy: {
          [sortBy]: order,
        },
        skip,
        take: limit,
      }),
      db.game.count({
        where: whereConditions,
      }),
    ])

    const response = NextResponse.json({
      games,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    
    return response
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}