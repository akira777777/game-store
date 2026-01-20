import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"

export const revalidate = 3600 // Revalidate every hour
export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const game = await db.game.findUnique({
      where: { slug: params.slug },
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const response = NextResponse.json({ game })
    
    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    
    return response
  } catch (error) {
    logger.error("Error fetching game by slug", error, {
      slug: params.slug,
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
