import { GameGrid } from "@/components/game/game-grid"
import { HeroSection } from "@/components/layout/hero-section"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  try {
    const featuredGamesPromise = db.game.findMany({
      where: { featured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    })

    const newGamesPromise = db.game.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    })

    // Get discounted games using database query
    const discountedGamesPromise = db.game.findMany({
      where: {
        inStock: true,
        discountPrice: {
          not: null,
          gt: 0,
        },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    })

    const [featuredGames, newGames, discountedGames] = await Promise.all([
      featuredGamesPromise,
      newGamesPromise,
      discountedGamesPromise,
    ])

    return (
      <div className="flex flex-col">
        <HeroSection />

        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Featured Games Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Рекомендуемые игры</h2>
                  <p className="text-sm text-muted-foreground">
                    Самые популярные и востребованные игры
                  </p>
                </div>
              </div>
              <Link href="/games?featured=true">
                <Button variant="outline" className="gap-2">
                  Все игры
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {featuredGames.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  Пока нет рекомендуемых игр
                </p>
                <p className="text-sm text-muted-foreground">
                  Рекомендуемые игры появятся здесь, когда администратор их добавит
                </p>
              </div>
            ) : (
              <GameGrid games={featuredGames} />
            )}
          </section>

          {/* New Games Section */}
          {newGames.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg">🆕</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Новинки</h2>
                    <p className="text-sm text-muted-foreground">
                      Только что добавленные игры в наш каталог
                    </p>
                  </div>
                </div>
                <Link href="/games?sort=newest">
                  <Button variant="outline" className="gap-2">
                    Все новинки
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <GameGrid games={newGames.slice(0, 8)} />
            </section>
          )}

          {/* Discounted Games Section */}
          {discountedGames.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <span className="text-lg">🔥</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Скидки</h2>
                    <p className="text-sm text-muted-foreground">
                      Игры со специальными ценами
                    </p>
                  </div>
                </div>
                <Link href="/games?sort=price_asc">
                  <Button variant="outline" className="gap-2">
                    Все скидки
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <GameGrid games={discountedGames.slice(0, 8)} />
            </section>
          )}
        </div>
      </div>
    )
  } catch (error) {
    throw error
  }
}
