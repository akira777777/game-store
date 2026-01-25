import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * POST /api/promo/validate - Validate a promo code and calculate discount
 */
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
    const { code, cartTotal } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      )
    }

    if (typeof cartTotal !== "number" || cartTotal <= 0) {
      return NextResponse.json(
        { error: "Invalid cart total" },
        { status: 400 }
      )
    }

    // Find promo code (case-insensitive)
    const promoCode = await db.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    })

    if (!promoCode) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 404 }
      )
    }

    // Check if active
    if (!promoCode.active) {
      return NextResponse.json(
        { error: "This promo code is no longer active" },
        { status: 400 }
      )
    }

    // Check validity period
    const now = new Date()
    if (promoCode.validFrom > now) {
      return NextResponse.json(
        { error: "This promo code is not yet valid" },
        { status: 400 }
      )
    }

    if (promoCode.validUntil && promoCode.validUntil < now) {
      return NextResponse.json(
        { error: "This promo code has expired" },
        { status: 400 }
      )
    }

    // Check usage limit
    if (promoCode.usageLimit !== null && promoCode.usageCount >= promoCode.usageLimit) {
      return NextResponse.json(
        { error: "This promo code has reached its usage limit" },
        { status: 400 }
      )
    }

    // Check minimum purchase
    if (promoCode.minPurchase && cartTotal < promoCode.minPurchase) {
      return NextResponse.json(
        { 
          error: `Minimum purchase of $${promoCode.minPurchase.toFixed(2)} required for this promo code`,
          minPurchase: promoCode.minPurchase,
        },
        { status: 400 }
      )
    }

    // Calculate discount
    let discountAmount = 0
    if (promoCode.discountType === "PERCENTAGE") {
      discountAmount = (cartTotal * promoCode.discountValue) / 100
      // Apply max discount if specified
      if (promoCode.maxDiscount !== null && discountAmount > promoCode.maxDiscount) {
        discountAmount = promoCode.maxDiscount
      }
    } else if (promoCode.discountType === "FIXED") {
      discountAmount = Math.min(promoCode.discountValue, cartTotal)
    }

    const finalTotal = Math.max(0, cartTotal - discountAmount)

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      description: promoCode.description,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      discountAmount,
      originalTotal: cartTotal,
      finalTotal,
    })
  } catch (error) {
    logger.error("Error validating promo code:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
