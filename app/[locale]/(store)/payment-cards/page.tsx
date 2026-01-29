import { PaymentCardsList } from "@/components/payment-card/payment-cards-list"
import { PageHeader } from "@/components/layout/page-header"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

interface SearchParams {
  cardType?: string
  region?: string
  search?: string
  page?: string
}

export default async function PaymentCardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  try {
    const page = Math.max(1, parseInt(params.page || "1", 10) || 1)
    const limit = 12
    const skip = (page - 1) * limit

    const whereConditions: Record<string, unknown> = {
      inStock: true,
    }

    if (params.cardType?.trim()) {
      whereConditions.cardType = params.cardType.trim()
    }

    if (params.region?.trim()) {
      whereConditions.region = params.region.trim()
    }

    if (params.search?.trim()) {
      const databaseUrl = process.env.DATABASE_URL?.trim() || ''
      const isSQLite = databaseUrl.startsWith('file:')
      const searchTerm = params.search.trim()
      const searchCondition = isSQLite
        ? { contains: searchTerm }
        : { contains: searchTerm, mode: 'insensitive' as const }
      
      whereConditions.OR = [
        {
          title: searchCondition,
        },
        {
          description: searchCondition,
        },
      ]
    }

    const [cards, total] = await Promise.all([
      db.paymentCard.findMany({
        where: whereConditions,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.paymentCard.count({
        where: whereConditions,
      }),
    ])

    // Get unique card types and regions for filters
    const allCards = await db.paymentCard.findMany({
      where: { inStock: true },
      select: { cardType: true, region: true },
    })
    const cardTypes = Array.from(new Set(allCards.map(c => c.cardType).filter(Boolean))) as string[]
    const regions = Array.from(new Set(allCards.map(c => c.region).filter(Boolean))) as string[]

    return (
      <main className="container mx-auto px-4 py-8" role="main">
        <PageHeader
          title="Платежные карты"
          description="Покупайте платежные карты различных типов и регионов"
          backUrl="/"
        />

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            className="px-4 py-2 border rounded-md bg-background"
            defaultValue={params.cardType || ""}
            onChange={(e) => {
              const urlParams = new URLSearchParams(window.location.search)
              if (e.target.value) {
                urlParams.set("cardType", e.target.value)
              } else {
                urlParams.delete("cardType")
              }
              window.location.search = urlParams.toString()
            }}
          >
            <option value="">Все типы</option>
            {cardTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border rounded-md bg-background"
            defaultValue={params.region || ""}
            onChange={(e) => {
              const urlParams = new URLSearchParams(window.location.search)
              if (e.target.value) {
                urlParams.set("region", e.target.value)
              } else {
                urlParams.delete("region")
              }
              window.location.search = urlParams.toString()
            }}
          >
            <option value="">Все регионы</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <PaymentCardsList cards={cards} total={total} />

        {/* Pagination */}
        {total > limit && (
          <div className="mt-8 flex justify-center gap-2">
            {page > 1 && (
              <a
                href={`?${new URLSearchParams({
                  ...(params as any),
                  page: String(page - 1),
                }).toString()}`}
                className="px-4 py-2 border rounded-md hover:bg-accent"
              >
                Назад
              </a>
            )}
            <span className="px-4 py-2">
              Страница {page} из {Math.ceil(total / limit)}
            </span>
            {page < Math.ceil(total / limit) && (
              <a
                href={`?${new URLSearchParams({
                  ...(params as any),
                  page: String(page + 1),
                }).toString()}`}
                className="px-4 py-2 border rounded-md hover:bg-accent"
              >
                Вперед
              </a>
            )}
          </div>
        )}
      </main>
    )
  } catch (error) {
    console.error("Error fetching payment cards:", error)
    return (
      <main className="container mx-auto px-4 py-8">
        <PageHeader title="Платежные карты" backUrl="/" />
        <div className="text-center py-12">
          <p className="text-destructive">Ошибка при загрузке карт</p>
        </div>
      </main>
    )
  }
}
