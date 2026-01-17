import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export const dynamic = 'force-dynamic'

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

    return NextResponse.json({
      games,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
