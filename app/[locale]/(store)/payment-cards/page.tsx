import { PaymentCard } from "@/components/payment-card/payment-card"
import { mockPaymentCards } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  cardType?: string
  region?: string
  page?: string
}

export default async function PaymentCardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  // Use mock data
  let cards = [...mockPaymentCards]

  // Simple filtering
  if (params.cardType) {
    cards = cards.filter(card => card.cardType === params.cardType)
  }

  if (params.region) {
    cards = cards.filter(card => card.region === params.region)
  }

  const page = Math.max(1, parseInt(params.page || "1", 10) || 1)
  const limit = 12
  const total = cards.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedCards = cards.slice(start, start + limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Платежные карты</h1>
        <p className="text-muted-foreground">
          Демо-режим: показываются примеры карт. Полный функционал доступен с подключенной базой данных.
        </p>
      </div>

      {paginatedCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Карты не найдены
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedCards.map((card) => (
              <PaymentCard key={card.id} card={card} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page <= 1}
              >
                <Link href={`/payment-cards?page=${page - 1}`}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Назад
                </Link>
              </Button>

              <span className="text-sm text-muted-foreground">
                Страница {page} из {totalPages}
              </span>

              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
              >
                <Link href={`/payment-cards?page=${page + 1}`}>
                  Вперед
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
