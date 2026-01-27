"use client"

import { PaymentCard } from "./payment-card"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentCardsListProps {
  cards: Array<{
    id: string
    title: string
    slug: string
    description: string | null
    cardType: string
    region: string | null
    currency: string | null
    denomination: number | null
    price: number
    discountPrice: number | null
    images: string
    inStock: boolean
    featured?: boolean
  }>
  total: number
}

export function PaymentCardsList({ cards, total }: PaymentCardsListProps) {
  if (cards.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 py-12 text-center">
        <p className="text-muted-foreground text-lg font-medium">Платежные карты не найдены</p>
        <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить параметры фильтра</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <PaymentCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
