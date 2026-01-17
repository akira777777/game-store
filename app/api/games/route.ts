import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const genre = searchParams.get("genre")
    const platform = searchParams.get("platform")
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const order = searchParams.get("order") || "desc"

    const skip = (page - 1) * limit

    // Get all games first (SQLite doesn't support array contains in where)
    let games = await db.game.findMany({
      where: {
        inStock: true,
      },
      orderBy: {
        [sortBy]: order,
      },
    })

    // Filter by genre/platform/search in memory
    if (genre) {
      games = games.filter(game => {
        const genres = typeof game.genres === 'string' ? JSON.parse(game.genres || '[]') : game.genres
        return Array.isArray(genres) ? genres.includes(genre) : false
      })
    }

    if (platform) {
      games = games.filter(game => {
        const platforms = typeof game.platforms === 'string' ? JSON.parse(game.platforms || '[]') : game.platforms
        return Array.isArray(platforms) ? platforms.includes(platform) : false
      })
    }

    if (search) {
      const searchLower = search.toLowerCase()
      games = games.filter(game => 
        game.title.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower)
      )
    }

    const total = games.length
    
    // Apply pagination
    games = games.slice(skip, skip + limit)

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
