import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get cart items
    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: { game: true },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      )
    }

    // Validate all cart items are in stock
    const outOfStockItems = cartItems.filter(item => !item.game.inStock)
    if (outOfStockItems.length > 0) {
      return NextResponse.json(
        { error: "Some items in your cart are out of stock" },
        { status: 400 }
      )
    }

    // Calculate total with validation
    const total = cartItems.reduce((sum, item) => {
      const price = Number(item.game.discountPrice || item.game.price)
      if (!isFinite(price) || price < 0) {
        throw new Error(`Invalid price for game: ${item.game.title}`)
      }
      return sum + price * item.quantity
    }, 0)

    if (!isFinite(total) || total <= 0) {
      return NextResponse.json(
        { error: "Invalid cart total" },
        { status: 400 }
      )
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Payment service is not configured" },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => {
        const images = typeof item.game.images === 'string'
          ? JSON.parse(item.game.images || '[]')
          : (Array.isArray(item.game.images) ? item.game.images : [])
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.game.title,
              images: images.length > 0 ? [images[0]] : [],
            },
            unit_amount: Math.round(
              Number(item.game.discountPrice || item.game.price) * 100
            ),
          },
          quantity: item.quantity,
        }
      }),
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      metadata: {
        userId: session.user.id,
      },
    })

    // Create order
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        total: total,
        status: "PENDING",
        stripeSessionId: stripeSession.id,
        items: {
          create: cartItems.map((item) => ({
            gameId: item.gameId,
            quantity: item.quantity,
            price: item.game.discountPrice || item.game.price,
          })),
        },
      },
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
