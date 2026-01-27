import { GameGrid } from "@/components/game/game-grid"
import { CategoriesSection } from "@/components/layout/categories-section"
import { CtaSection } from "@/components/layout/cta-section"
import { HeroSection } from "@/components/layout/hero-section"
import { ValuePropsSection } from "@/components/layout/value-props-section"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { db } from "@/lib/db"
import { ArrowRight, TrendingUp } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: _locale } = await params
  void _locale
  const t = await getTranslations("home")

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
      <ErrorBoundary>
        <div className="flex flex-col">
          <HeroSection />

          <main className="container mx-auto px-4 py-12 space-y-16" role="main">
            <ValuePropsSection />

            {/* Categories Section */}
            <CategoriesSection />

            {/* Featured Games Section */}
            <section className="space-y-6" aria-labelledby="featured-heading">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-md">
                    <TrendingUp className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="featured-heading" className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{t("featuredGames.title")}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t("featuredGames.description")}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" className="gap-2 w-full sm:w-auto hover:scale-105 transition-transform" aria-label={t("featuredGames.allGames")}>
                  <Link href="/games?featured=true">
                    {t("featuredGames.allGames")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              {featuredGames.length > 0 && (
                <p className="text-sm text-muted-foreground -mt-2">
                  {t("featuredGames.showCount", { count: featuredGames.length })}
                </p>
              )}

              {featuredGames.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    {t("featuredGames.empty")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("featuredGames.emptyDescription")}
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-green-600 dark:text-green-400 shadow-md">
                      <span className="text-xl" aria-hidden="true">🆕</span>
                    </div>
                    <div>
                      <h2 id="new-games-heading" className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{t("newGames.title")}</h2>
                      <p className="text-sm text-muted-foreground">
                        {t("newGames.description")}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="gap-2 w-full sm:w-auto hover:scale-105 transition-transform" aria-label={t("newGames.allNew")}>
                    <Link href="/games?sort=newest">
                      {t("newGames.allNew")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-destructive/20 to-orange-500/10 text-destructive shadow-md animate-pulse">
                      <span className="text-xl" aria-hidden="true">🔥</span>
                    </div>
                    <div>
                      <h2 id="discounts-heading" className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">{t("discountedGames.title")}</h2>
                      <p className="text-sm text-muted-foreground">
                        {t("discountedGames.description")}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="gap-2 w-full sm:w-auto hover:scale-105 transition-transform" aria-label={t("discountedGames.allDiscounts")}>
                    <Link href="/games?sort=price_asc">
                      {t("discountedGames.allDiscounts")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
    throw error
  }
}