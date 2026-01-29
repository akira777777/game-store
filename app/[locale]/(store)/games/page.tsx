import { GameCard } from "@/components/game/game-card"
import { mockGames } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  genre?: string
  platform?: string
  search?: string
  page?: string
  sortBy?: string
  sort?: string
  order?: string
  featured?: string
  minPrice?: string
  maxPrice?: string
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  // Use mock data
  let games = [...mockGames]

  // Simple filtering based on search params
  if (params.featured === "true") {
    games = games.filter(game => game.featured)
  }

  if (params.search?.trim()) {
    const search = params.search.trim().toLowerCase()
    games = games.filter(game => 
      game.title.toLowerCase().includes(search) ||
      game.description.toLowerCase().includes(search)
    )
  }

  const page = Math.max(1, parseInt(params.page || "1", 10) || 1)
  const limit = 12
  const total = games.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedGames = games.slice(start, start + limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Каталог игр</h1>
        <p className="text-muted-foreground">
          Демо-режим: показываются примеры игр. Полный функционал доступен с подключенной базой данных.
        </p>
      </div>

      {paginatedGames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Игры не найдены
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedGames.map((game) => (
              <GameCard key={game.id} game={game} />
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
                <Link href={`/games?page=${page - 1}`}>
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
                <Link href={`/games?page=${page + 1}`}>
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
