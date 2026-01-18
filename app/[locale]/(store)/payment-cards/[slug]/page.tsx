import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { AddToCartButton } from "@/components/payment-card/add-to-cart-button"
import { db } from "@/lib/db"
import { formatCurrency } from "@/lib/utils"
import { CreditCard } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

function parseJsonArrayOrString(value: string | string[]): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : [parsed].filter(Boolean)
    } catch {
      return value ? [value] : []
    }
  }
  return []
}

export default async function PaymentCardPage({
  params,
}: {
  params: { slug: string }
}) {
  const card = await db.paymentCard.findUnique({
    where: { slug: params.slug },
  })

  if (!card) {
    notFound()
  }

  const finalPrice = card.discountPrice ?? card.price
  const hasDiscount = card.discountPrice !== null && card.discountPrice < card.price
  const images = parseJsonArrayOrString(card.images)

  // Find related cards (same type, exclude current card)
  const relatedCards = await db.paymentCard.findMany({
    where: {
      id: { not: card.id },
      inStock: true,
      cardType: card.cardType,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="container mx-auto px-4 py-8" role="main">
      <PageHeader
        title={card.title}
        description={card.description || undefined}
        backUrl="/payment-cards"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  <Image
                    src={images[0]}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CreditCard className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{card.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{card.cardType}</Badge>
              {card.region && (
                <Badge variant="outline">{card.region}</Badge>
              )}
              {card.denomination && (
                <Badge variant="outline">
                  {card.currency || "$"}{card.denomination}
                </Badge>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Цена</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {hasDiscount ? (
                  <div>
                    <span className="text-4xl font-bold text-destructive">
                      {formatCurrency(finalPrice)}
                    </span>
                    <span className="ml-3 text-xl line-through text-muted-foreground">
                      {formatCurrency(card.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold">
                    {formatCurrency(finalPrice)}
                  </span>
                )}
              </div>
              {card.inStock ? (
                <AddToCartButton cardId={card.id} className="w-full" />
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Нет в наличии
                </Button>
              )}
            </CardContent>
          </Card>

          {card.description && (
            <Card>
              <CardHeader>
                <CardTitle>Описание</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Related Cards */}
          {relatedCards.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Похожие карты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {relatedCards.slice(0, 4).map((relatedCard) => (
                    <a
                      key={relatedCard.id}
                      href={`/payment-cards/${relatedCard.slug}`}
                      className="p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <p className="font-medium text-sm">{relatedCard.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(relatedCard.discountPrice ?? relatedCard.price)}
                      </p>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
