import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime for SQLite compatibility
export const runtime = 'nodejs';

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
      include: {
        game: true,
        paymentCard: true,
      },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      )
    }

    // Filter out items without game or paymentCard
    const validItems = cartItems.filter(item => item.game || item.paymentCard)
    if (validItems.length === 0) {
      return NextResponse.json(
        { error: "All items in your cart are invalid" },
        { status: 400 }
      )
    }

    // Validate all cart items are in stock
    const outOfStockItems = validItems.filter(item => {
      const product = item.game || item.paymentCard
      return product && !product.inStock
    })
    if (outOfStockItems.length > 0) {
      return NextResponse.json(
        { error: "Some items in your cart are out of stock" },
        { status: 400 }
      )
    }

    // Calculate total with validation
    const total = validItems.reduce((sum, item) => {
      const product = item.game || item.paymentCard
      if (!product) return sum
      const price = Number(product.discountPrice || product.price)
      if (!isFinite(price) || price < 0) {
        throw new Error(`Invalid price for item: ${product.title}`)
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
      line_items: validItems.map((item) => {
        const product = item.game || item.paymentCard
        if (!product) {
          throw new Error("Invalid cart item")
        }
        const images = typeof product.images === 'string'
          ? JSON.parse(product.images || '[]')
          : (Array.isArray(product.images) ? product.images : [])
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              images: images.length > 0 ? [images[0]] : [],
            },
            unit_amount: Math.round(
              Number(product.discountPrice || product.price) * 100
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
          create: validItems.map((item) => {
            const product = item.game || item.paymentCard
            if (!product) {
              throw new Error("Invalid cart item")
            }
            return {
              gameId: item.gameId || null,
              paymentCardId: item.paymentCardId || null,
              quantity: item.quantity,
              price: product.discountPrice || product.price,
            }
          }),
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
