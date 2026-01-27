import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { CreditCard, Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminPaymentCardsPage() {
  const cards = await db.paymentCard.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Управление платежными картами</h1>
        <Button asChild>
          <Link href="/admin/payment-cards/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить карту
          </Link>
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Платежных карт пока нет</p>
            <Button asChild>
              <Link href="/admin/payment-cards/new">
                <Plus className="mr-2 h-4 w-4" />
                Добавить первую карту
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            return (
              <Card key={card.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <div className="flex gap-2">
                      {card.featured && (
                        <Badge variant="default">Популярная</Badge>
                      )}
                      {card.inStock ? (
                        <Badge variant="default">В наличии</Badge>
                      ) : (
                        <Badge variant="secondary">Нет в наличии</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Тип:</span> {card.cardType}
                    </p>
                    {card.region && (
                      <p className="text-sm">
                        <span className="font-medium">Регион:</span> {card.region}
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-medium">Цена:</span> ${card.price}
                      {card.discountPrice && (
                        <span className="text-muted-foreground line-through ml-2">
                          ${card.discountPrice}
                        </span>
                      )}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Остаток:</span> {card.stockQuantity}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/admin/payment-cards/${card.id}/edit`}>
                        Редактировать
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
