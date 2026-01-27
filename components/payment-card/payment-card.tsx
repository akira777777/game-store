"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AddToCartButton } from "./add-to-cart-button"

interface PaymentCardProps {
  card: {
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
  }
}

export function PaymentCard({ card }: PaymentCardProps) {
  const images = typeof card.images === "string" 
    ? JSON.parse(card.images || "[]") 
    : card.images || []
  const mainImage = images[0] || "/placeholder-card.png"
  
  const finalPrice = card.discountPrice ?? card.price
  const hasDiscount = card.discountPrice !== null && card.discountPrice < card.price

  return (
    <Card className="group flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <Link href={`/payment-cards/${card.slug}`} className="flex flex-col flex-1">
        <CardHeader className="p-0 relative overflow-hidden">
          <div className="relative aspect-video w-full bg-muted">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CreditCard className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          {card.featured && (
            <Badge className="absolute top-2 right-2" variant="default">
              Популярная
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              Скидка
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-1 p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {card.title}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {card.cardType}
            </Badge>
            {card.region && (
              <Badge variant="outline" className="text-xs">
                {card.region}
              </Badge>
            )}
            {card.denomination && (
              <Badge variant="outline" className="text-xs">
                {card.currency || "$"}{card.denomination}
              </Badge>
            )}
          </div>

          {card.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div>
              {hasDiscount ? (
                <div>
                  <span className="text-xl font-bold text-destructive">
                    {formatCurrency(finalPrice)}
                  </span>
                  <span className="ml-2 text-sm line-through text-muted-foreground">
                    {formatCurrency(card.price)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold">
                  {formatCurrency(finalPrice)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        {card.inStock ? (
          <AddToCartButton cardId={card.id} className="w-full" />
        ) : (
          <Button className="w-full" disabled>
            Нет в наличии
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
