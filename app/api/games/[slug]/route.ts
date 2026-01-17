import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const game = await db.game.findUnique({
      where: { slug: params.slug },
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    return NextResponse.json({ game })
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
