import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ items: [] })
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: { game: true },
    })

    return NextResponse.json({ items: cartItems })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { gameId, quantity = 1 } = body

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      )
    }

    // Check if game exists and is in stock
    const game = await db.game.findUnique({
      where: { id: gameId },
    })

    if (!game || !game.inStock) {
      return NextResponse.json(
        { error: "Game not found or out of stock" },
        { status: 404 }
      )
    }

    // Upsert cart item
    const cartItem = await db.cartItem.upsert({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId: gameId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: session.user.id,
        gameId: gameId,
        quantity: quantity,
      },
      include: { game: true },
    })

    return NextResponse.json({ item: cartItem })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("gameId")

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      )
    }

    await db.cartItem.delete({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId: gameId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { gameId, quantity } = body

    if (!gameId || quantity === undefined) {
      return NextResponse.json(
        { error: "Game ID and quantity are required" },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      await db.cartItem.delete({
        where: {
          userId_gameId: {
            userId: session.user.id,
            gameId: gameId,
          },
        },
      })
      return NextResponse.json({ success: true })
    }

    const cartItem = await db.cartItem.update({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId: gameId,
        },
      },
      data: { quantity },
      include: { game: true },
    })

    return NextResponse.json({ item: cartItem })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
