import { GameGrid } from "@/components/game/game-grid"
import { CtaSection } from "@/components/layout/cta-section"
import { HeroSection } from "@/components/layout/hero-section"
import { ValuePropsSection } from "@/components/layout/value-props-section"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { db } from "@/lib/db"
import { ArrowRight, TrendingUp } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour
export const runtime = 'nodejs' // Ensure Node.js runtime for Prisma adapter

export const metadata: Metadata = {
  title: "Главная",
  description: "Откройте мир видеоигр. Современный интернет-магазин с лучшими играми для всех платформ. Эксклюзивные скидки и мгновенная доставка цифровых копий.",
  openGraph: {
    title: "Game Store - Главная",
    description: "Откройте мир видеоигр. Современный интернет-магазин с лучшими играми для всех платформ.",
  },
}

export default async function HomePage() {
  // #region agent log
  const logPath = 'c:\\Users\\-\\Desktop\\game-store\\.cursor\\debug.log';
  const logDataEntry = { location: 'app/(store)/page.tsx:24', message: 'HomePage entry', data: { runtime: typeof window === 'undefined' ? 'server' : 'client' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'F' };
  require('fs').appendFileSync(logPath, JSON.stringify(logDataEntry) + '\n');
  // #endregion
  try {
    // #region agent log
    const logDataBefore = { location: 'app/(store)/page.tsx:28', message: 'Before DB queries', data: { hasDb: !!db }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'G' };
    require('fs').appendFileSync(logPath, JSON.stringify(logDataBefore) + '\n');
    // #endregion

    let featuredGamesPromise, newGamesPromise, discountedGamesPromise;
    try {
      featuredGamesPromise = db.game.findMany({
        where: { featured: true },
        take: 8,
        orderBy: { createdAt: "desc" },
      })

      newGamesPromise = db.game.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      })

      discountedGamesPromise = db.game.findMany({
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

      // #region agent log
      const logDataQueries = { location: 'app/(store)/page.tsx:50', message: 'DB queries started', data: { queriesCreated: true }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H' };
      require('fs').appendFileSync(logPath, JSON.stringify(logDataQueries) + '\n');
      // #endregion
    } catch (queryError: any) {
      // #region agent log
      const logDataQueryErr = { location: 'app/(store)/page.tsx:53', message: 'DB query creation error', data: { errorMessage: queryError?.message || String(queryError), errorName: queryError?.name || 'unknown' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H' };
      require('fs').appendFileSync(logPath, JSON.stringify(logDataQueryErr) + '\n');
      // #endregion
      throw queryError;
    }

    const [featuredGames, newGames, discountedGames] = await Promise.all([
      featuredGamesPromise,
      newGamesPromise,
      discountedGamesPromise,
    ])

    // #region agent log
    const logDataAfter = { location: 'app/(store)/page.tsx:65', message: 'After DB queries', data: { featuredCount: featuredGames.length, newCount: newGames.length, discountedCount: discountedGames.length, featuredGames: featuredGames.map(g => ({ id: g.id, title: g.title })), newGames: newGames.map(g => ({ id: g.id, title: g.title })) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'H' };
    require('fs').appendFileSync(logPath, JSON.stringify(logDataAfter) + '\n');
    // #endregion

    return (
      <ErrorBoundary>
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
                <Button asChild variant="outline" className="gap-2 w-full sm:w-auto" aria-label="Перейти к рекомендуемым играм">
                  <Link href="/games?featured=true">
                    Все игры
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              {featuredGames.length > 0 && (
                <p className="text-sm text-muted-foreground -mt-2">
                  Показано {featuredGames.length} {featuredGames.length === 1 ? 'игра' : featuredGames.length < 5 ? 'игры' : 'игр'}
                </p>
              )}

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
                  <Button asChild variant="outline" className="gap-2 w-full sm:w-auto" aria-label="Перейти к новинкам">
                    <Link href="/games?sort=newest">
                      Все новинки
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
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
                  <Button asChild variant="outline" className="gap-2 w-full sm:w-auto" aria-label="Перейти к скидкам">
                    <Link href="/games?sort=price_asc">
                      Все скидки
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
                <GameGrid games={discountedGames.slice(0, 8)} />
              </section>
            )}

            <CtaSection />
          </main>
        </div>
      </ErrorBoundary>
    )
  } catch (error) {
    // #region agent log
    const logPath = 'c:\\Users\\-\\Desktop\\game-store\\.cursor\\debug.log';
    const logDataErr = { location: 'app/(store)/page.tsx:173', message: 'HomePage error', data: { errorMessage: error instanceof Error ? error.message : String(error), errorName: error instanceof Error ? error.name : 'unknown', errorStack: error instanceof Error ? error.stack?.substring(0, 200) : 'no stack' }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'F' };
    require('fs').appendFileSync(logPath, JSON.stringify(logDataErr) + '\n');
    // #endregion
    throw error
  }
}
