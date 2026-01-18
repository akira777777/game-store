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
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Платежные карты не найдены</p>
        </CardContent>
      </Card>
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
