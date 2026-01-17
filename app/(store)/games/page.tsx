import { GameCard } from "@/components/game/game-card"
import { GameFilters } from "@/components/game/game-filters"
import { db } from "@/lib/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface SearchParams {
  genre?: string
  platform?: string
  search?: string
  page?: string
  sortBy?: string
  sort?: string
  order?: string
  featured?: string
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  try {
    // Input validation with limits
    const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1)
    const limit = 12
    const skip = (page - 1) * limit

    // Build where clause for PostgreSQL JSON queries
    const whereConditions: any = {
      inStock: true,
    }

    // Filter by featured
    if (searchParams.featured === "true") {
      whereConditions.featured = true
    }

    // Filter by genre using PostgreSQL JSON contains
    if (searchParams.genre?.trim()) {
      whereConditions.genres = {
        contains: `"${searchParams.genre.trim()}"`,
      }
    }

    // Filter by platform using PostgreSQL JSON contains
    if (searchParams.platform?.trim()) {
      whereConditions.platforms = {
        contains: `"${searchParams.platform.trim()}"`,
      }
    }

    // Filter by search in title or description
    if (searchParams.search?.trim()) {
      whereConditions.OR = [
        {
          title: {
            contains: searchParams.search.trim(),
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchParams.search.trim(),
            mode: 'insensitive',
          },
        },
      ]
    }

    // Determine sort order
    const sortByParam = searchParams.sort || searchParams.sortBy || "newest"
    let orderBy: any = { createdAt: "desc" }

    if (sortByParam === "newest") {
      orderBy = { createdAt: "desc" }
    } else if (sortByParam === "oldest") {
      orderBy = { createdAt: "asc" }
    } else if (sortByParam === "price_asc") {
      orderBy = { price: "asc" }
    } else if (sortByParam === "price_desc") {
      orderBy = { price: "desc" }
    }

    // Execute query with filters and sorting at database level
    const [games, total] = await Promise.all([
      db.game.findMany({
        where: whereConditions,
        orderBy,
        skip,
        take: limit,
      }),
      db.game.count({
        where: whereConditions,
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
      <div className="container mx-auto px-4 py-8">
        <header>
          <h1 className="text-4xl font-bold mb-8">Каталог игр</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1" aria-label="Фильтры каталога игр">
            <GameFilters />
          </aside>

          <main className="lg:col-span-3" role="main">
            {games.length === 0 ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <p className="text-muted-foreground text-lg">
                  Игры не найдены
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Попробуйте изменить параметры фильтрации
                </p>
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                  role="list"
                  aria-label={`Список игр, найдено ${games.length}`}
                >
                  {games.map((game) => (
                    <article key={game.id} role="listitem">
                      <GameCard game={game} />
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Пагинация страниц" className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        const searchParamsString = new URLSearchParams()
                        if (searchParams.genre) searchParamsString.set("genre", searchParams.genre)
                        if (searchParams.platform) searchParamsString.set("platform", searchParams.platform)
                        if (searchParams.search) searchParamsString.set("search", searchParams.search)
                        searchParamsString.set("page", pageNum.toString())

                        return (
                          <Link
                            key={pageNum}
                            href={`/games?${searchParamsString.toString()}`}
                            className={`px-4 py-2 rounded-md transition-colors ${page === pageNum
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "bg-muted hover:bg-muted/80"
                              }`}
                            aria-label={`Страница ${pageNum}`}
                            aria-current={page === pageNum ? "page" : undefined}
                          >
                            {pageNum}
                          </Link>
                        )
                      }
                    )}
                  </nav>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    )
  } catch (error) {
    throw error
  }
}
