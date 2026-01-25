import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      logger.warn("Webhook request missing signature or secret", {
        hasSignature: !!signature,
        hasSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      })
      return NextResponse.json(
        { error: "Missing signature or webhook secret" },
        { status: 400 }
      )
    }

    if (!stripe) {
      logger.error("Stripe client not initialized")
      return NextResponse.json(
        { error: "Stripe client not configured" },
        { status: 500 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      logger.error("Webhook signature verification failed", error, {
        signatureLength: signature.length,
      })
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      )
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session

        // Update order status and get order items
        const order = await db.order.update({
          where: { stripeSessionId: session.id },
          data: { status: "PAID" },
          include: {
            items: {
              include: {
                game: true,
                paymentCard: true,
              },
            },
          },
        })

        // Decrement stock for purchased items
        for (const item of order.items) {
          try {
            if (item.gameId && item.game) {
              await db.game.update({
                where: { id: item.gameId },
                data: { 
                  stockQuantity: { 
                    decrement: item.quantity 
                  } 
                },
              })
              logger.info("Decremented game stock", {
                gameId: item.gameId,
                quantity: item.quantity,
                orderId: order.id,
              })
            } else if (item.paymentCardId && item.paymentCard) {
              await db.paymentCard.update({
                where: { id: item.paymentCardId },
                data: { 
                  stockQuantity: { 
                    decrement: item.quantity 
                  } 
                },
              })
              logger.info("Decremented payment card stock", {
                paymentCardId: item.paymentCardId,
                quantity: item.quantity,
                orderId: order.id,
              })
            }
          } catch (stockError) {
            logger.error("Error updating stock", stockError, {
              orderId: order.id,
              itemId: item.id,
            })
          }
        }

        // Clear user's cart
        if (session.metadata?.userId) {
          const deletedItems = await db.cartItem.deleteMany({
            where: { userId: session.metadata.userId },
          })
          logger.info("Cart cleared after successful payment", {
            userId: session.metadata.userId,
            orderId: order.id,
            deletedItemsCount: deletedItems.count,
          })
        }
      }

      return NextResponse.json({ received: true })
    } catch (error) {
      logger.error("Error processing webhook", error, {
        eventType: event.type,
        eventId: event.id,
      })
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  } catch (error) {
    logger.error("Error in webhook handler", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
