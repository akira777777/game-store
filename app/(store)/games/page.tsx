import { db } from "@/lib/db"
import { GameCard } from "@/components/game/game-card"
import { GameFilters } from "@/components/game/game-filters"

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
    const page = parseInt(searchParams.page || "1")
    const limit = 12
    const skip = (page - 1) * limit

    // Get all games first (SQLite doesn't support array contains in where)
    let allGames = await db.game.findMany({
      where: {
        inStock: true,
      },
    })

    // Filter by featured
    if (searchParams.featured === "true") {
      allGames = allGames.filter(game => game.featured === true)
    }

    // Filter by genre/platform/search in memory
    if (searchParams.genre) {
      allGames = allGames.filter(game => {
        const genres = typeof game.genres === 'string' ? JSON.parse(game.genres || '[]') : game.genres
        return Array.isArray(genres) ? genres.includes(searchParams.genre) : false
      })
    }

    if (searchParams.platform) {
      allGames = allGames.filter(game => {
        const platforms = typeof game.platforms === 'string' ? JSON.parse(game.platforms || '[]') : game.platforms
        return Array.isArray(platforms) ? platforms.includes(searchParams.platform) : false
      })
    }

    if (searchParams.search) {
      const searchLower = searchParams.search.toLowerCase()
      allGames = allGames.filter(game => 
        game.title.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower)
      )
    }

    // Sort - support both 'sort' and 'sortBy' parameters
    const sortByParam = searchParams.sort || searchParams.sortBy || "newest"
  if (sortByParam === "newest") {
    allGames.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortByParam === "oldest") {
    allGames.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  } else if (sortByParam === "price_asc") {
    allGames.sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortByParam === "price_desc") {
    allGames.sort((a, b) => Number(b.price) - Number(a.price))
  }

    const total = allGames.length
    const games = allGames.slice(skip, skip + limit)

    const totalPages = Math.ceil(total / limit)

    return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Каталог игр</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <GameFilters />
        </aside>

        <main className="lg:col-span-3">
          {games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Игры не найдены
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <a
                        key={pageNum}
                        href={`/games?page=${pageNum}${
                          searchParams.genre ? `&genre=${searchParams.genre}` : ""
                        }${
                          searchParams.platform
                            ? `&platform=${searchParams.platform}`
                            : ""
                        }${searchParams.search ? `&search=${searchParams.search}` : ""}`}
                        className={`px-4 py-2 rounded-md ${
                          page === pageNum
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {pageNum}
                      </a>
                    )
                  )}
                </div>
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
