import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime for SQLite compatibility
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ items: [] });
    }

    // Only select necessary fields from game/paymentCard to reduce payload size
    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            discountPrice: true,
            images: true,
            inStock: true,
          },
        },
        paymentCard: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            discountPrice: true,
            images: true,
            inStock: true,
          },
        },
      },
    });

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, paymentCardId, quantity = 1 } = body;

    // Validate that exactly one ID is provided
    if (!gameId && !paymentCardId) {
      return NextResponse.json(
        { error: "Game ID or Payment Card ID is required" },
        { status: 400 },
      );
    }

    if (gameId && paymentCardId) {
      return NextResponse.json(
        { error: "Cannot specify both gameId and paymentCardId" },
        { status: 400 },
      );
    }

    // Validate quantity
    const validQuantity = Math.max(
      1,
      Math.min(99, Math.floor(Number(quantity)) || 1),
    );
    let cartItem: any = null;

    if (gameId) {
      // Handle game
      const game = await db.game.findUnique({
        where: { id: gameId },
      });

      if (!game || !game.inStock) {
        return NextResponse.json(
          { error: "Game not found or out of stock" },
          { status: 404 },
        );
      }

      cartItem = await db.cartItem.upsert({
        where: {
          userId_gameId: {
            userId: session.user.id,
            gameId: gameId,
          },
        },
        update: {
          quantity: { increment: validQuantity },
        },
        create: {
          userId: session.user.id,
          gameId: gameId,
          quantity: validQuantity,
        },
        include: {
          game: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              discountPrice: true,
              images: true,
              inStock: true,
            },
          },
        },
      });
    } else if (paymentCardId) {
      // Handle payment card
      const card = await db.paymentCard.findUnique({
        where: { id: paymentCardId },
      });

      if (!card || !card.inStock) {
        return NextResponse.json(
          { error: "Payment card not found or out of stock" },
          { status: 404 },
        );
      }

      cartItem = await db.cartItem.upsert({
        where: {
          userId_paymentCardId: {
            userId: session.user.id,
            paymentCardId: paymentCardId,
          },
        },
        update: {
          quantity: { increment: validQuantity },
        },
        create: {
          userId: session.user.id,
          paymentCardId: paymentCardId,
          quantity: validQuantity,
        },
        include: {
          paymentCard: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              discountPrice: true,
              images: true,
              inStock: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ item: cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");
    const paymentCardId = searchParams.get("paymentCardId");

    if (!gameId && !paymentCardId) {
      return NextResponse.json(
        { error: "Game ID or Payment Card ID is required" },
        { status: 400 },
      );
    }

    if (gameId) {
      await db.cartItem.delete({
        where: {
          userId_gameId: {
            userId: session.user.id,
            gameId: gameId,
          },
        },
      });
    } else if (paymentCardId) {
      await db.cartItem.delete({
        where: {
          userId_paymentCardId: {
            userId: session.user.id,
            paymentCardId: paymentCardId,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, paymentCardId, quantity } = body;

    if (!gameId && !paymentCardId) {
      return NextResponse.json(
        { error: "Game ID or Payment Card ID is required" },
        { status: 400 },
      );
    }

    if (quantity === undefined || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "Quantity is required" },
        { status: 400 },
      );
    }

    // Validate quantity range (0-99)
    const validQuantity = Math.max(
      0,
      Math.min(99, Math.floor(Number(quantity))),
    );
    let cartItem: any = null;

    if (validQuantity <= 0) {
      // Delete item if quantity is 0 or less
      if (gameId) {
        await db.cartItem.delete({
          where: {
            userId_gameId: {
              userId: session.user.id,
              gameId: gameId,
            },
          },
        });
      } else if (paymentCardId) {
        await db.cartItem.delete({
          where: {
            userId_paymentCardId: {
              userId: session.user.id,
              paymentCardId: paymentCardId,
            },
          },
        });
      }
      return NextResponse.json({ success: true });
    }

    if (gameId) {
      const cartItem = await db.cartItem.update({
        where: {
          userId_gameId: {
            userId: session.user.id,
            gameId: gameId,
          },
        },
        data: { quantity: validQuantity },
        include: {
          game: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              discountPrice: true,
              images: true,
              inStock: true,
            },
          },
        },
      });
      return NextResponse.json({ item: cartItem });
    } else if (paymentCardId) {
      cartItem = await db.cartItem.update({
        where: {
          userId_paymentCardId: {
            userId: session.user.id,
            paymentCardId: paymentCardId,
          },
        },
        data: { quantity: validQuantity },
        include: {
          paymentCard: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              discountPrice: true,
              images: true,
              inStock: true,
            },
          },
        },
      });
      return NextResponse.json({ item: cartItem });
    }

    return NextResponse.json({ item: cartItem });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
