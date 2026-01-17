import { GameGrid } from "@/components/game/game-grid"
import { CtaSection } from "@/components/layout/cta-section"
import { HeroSection } from "@/components/layout/hero-section"
import { ValuePropsSection } from "@/components/layout/value-props-section"
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

        <main className="container mx-auto px-4 py-12 space-y-16" role="main">
          <ValuePropsSection />

          {/* Featured Games Section */}
          <section className="space-y-6" aria-labelledby="featured-heading">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="featured-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">Рекомендуемые игры</h2>
                  <p className="text-sm text-muted-foreground">
                    Самые популярные и востребованные игры
                  </p>
                </div>
              </div>
              <Link href="/games?featured=true">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  Все игры
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
            <section className="space-y-6" aria-labelledby="new-games-heading">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg" aria-hidden="true">🆕</span>
                  </div>
                  <div>
                    <h2 id="new-games-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">Новинки</h2>
                    <p className="text-sm text-muted-foreground">
                      Только что добавленные игры в наш каталог
                    </p>
                  </div>
                </div>
                <Link href="/games?sort=newest">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    Все новинки
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
              <GameGrid games={newGames.slice(0, 8)} />
            </section>
          )}

          {/* Discounted Games Section */}
          {discountedGames.length > 0 && (
            <section className="space-y-6" aria-labelledby="discounts-heading">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <span className="text-lg" aria-hidden="true">🔥</span>
                  </div>
                  <div>
                    <h2 id="discounts-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">Скидки</h2>
                    <p className="text-sm text-muted-foreground">
                      Игры со специальными ценами
                    </p>
                  </div>
                </div>
                <Link href="/games?sort=price_asc">
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    Все скидки
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
              <GameGrid games={discountedGames.slice(0, 8)} />
            </section>
          )}

          <CtaSection />
        </main>
      </div>
    )
  } catch (error) {
    throw error
  }
}
