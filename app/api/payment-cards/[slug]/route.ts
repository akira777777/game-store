import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const card = await db.paymentCard.findUnique({
      where: { slug: params.slug },
    })

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
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
