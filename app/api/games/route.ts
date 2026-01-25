import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

// Use dynamic rendering but with aggressive caching
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour
export const runtime = 'nodejs' // Use Node.js runtime for better performance

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

    // Filter by genre using JSON contains (sanitized to prevent injection)
    if (genre) {
      // Sanitize genre input by escaping special characters and ensuring it's a valid string
      const sanitizedGenre = genre.replace(/["\\\0\n\r]/g, '').trim()
      if (sanitizedGenre) {
        whereConditions.genres = {
          contains: `"${sanitizedGenre}"`,
        }
      }
    }

    // Filter by platform using JSON contains (sanitized to prevent injection)
    if (platform) {
      // Sanitize platform input by escaping special characters and ensuring it's a valid string
      const sanitizedPlatform = platform.replace(/["\\\0\n\r]/g, '').trim()
      if (sanitizedPlatform) {
        whereConditions.platforms = {
          contains: `"${sanitizedPlatform}"`,
        }
      }
    }

    // Filter by search in title or description (case-insensitive)
    if (search) {
      whereConditions.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
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
    logger.error("Error fetching games:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
