"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Flame, Star, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data with working placeholder images
const trendingGames = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    rank: 1,
    price: 2999,
    discountPrice: 1499,
    discount: 50,
    image: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=800&h=450&fit=crop&q=80",
    rating: 4.5,
    reviews: 45230,
    tags: ["RPG", "Open World", "Sci-Fi"],
    trend: "up"
  },
  {
    id: 2,
    title: "Baldur's Gate 3",
    rank: 2,
    price: 3499,
    discountPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=450&fit=crop&q=80",
    rating: 4.9,
    reviews: 89450,
    tags: ["RPG", "Turn-Based", "Fantasy"],
    trend: "up"
  },
  {
    id: 3,
    title: "Starfield",
    rank: 3,
    price: 4299,
    discountPrice: 2999,
    discount: 30,
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=450&fit=crop&q=80",
    rating: 4.2,
    reviews: 34560,
    tags: ["RPG", "Space", "Exploration"],
    trend: "up"
  },
  {
    id: 4,
    title: "Hogwarts Legacy",
    rank: 4,
    price: 3799,
    discountPrice: null,
    discount: 0,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop&q=80",
    rating: 4.6,
    reviews: 56780,
    tags: ["Action", "Adventure", "Magic"],
    trend: "same"
  },
  {
    id: 5,
    title: "Elden Ring",
    rank: 5,
    price: 2999,
    discountPrice: 1999,
    discount: 33,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop&q=80",
    rating: 4.8,
    reviews: 123450,
    tags: ["Souls-like", "RPG", "Fantasy"],
    trend: "up"
  },
]

export function TrendingGamesSection() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-background via-orange-500/[0.02] to-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl animate-pulse" aria-hidden="true" />
        <div className="absolute bottom-1/3 right-1/3 h-96 w-96 rounded-full bg-red-500/5 blur-3xl animate-pulse delay-1000" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9731608_1px,transparent_1px),linear-gradient(to_bottom,#f9731608_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm animate-fade-in">
              <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Горячие продажи</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                Топ продаж
              </span>{" "}
              этой недели
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Самые популярные игры, которые покупают прямо сейчас. Обновляется каждый час!
            </p>
          </div>

          <Button asChild size="lg" className="gap-2 group shrink-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <Link href="/games?sort=popular">
              Весь топ
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Top 3 Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {trendingGames.slice(0, 3).map((game, index) => (
            <Card
              key={game.id}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md animate-scale-in"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Rank Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-lg shadow-lg ${game.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white' :
                    game.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900' :
                      'bg-gradient-to-br from-orange-600 to-orange-700 text-white'
                  }`}>
                  #{game.rank}
                </div>
                {game.discount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground animate-pulse">
                    -{game.discount}%
                  </Badge>
                )}
              </div>

              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                {/* Trend indicator */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-sm">
                    <TrendingUp className="h-4 w-4 text-white" />
                    <span className="text-xs font-bold text-white">Trending</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {game.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {game.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold text-foreground">{game.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({game.reviews.toLocaleString()} отзывов)
                    </span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="space-y-1">
                    {game.discountPrice ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {game.discountPrice} ₽
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground line-through">
                          {game.price} ₽
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-foreground">
                        {game.price} ₽
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="group/btn gap-2">
                    В корзину
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Remaining games - Compact list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingGames.slice(3, 5).map((game, index) => (
            <Card
              key={game.id}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-gradient-to-r from-background/95 to-background/80 backdrop-blur-md animate-slide-in-left"
              style={{
                animationDelay: `${(index + 3) * 0.1}s`,
              }}
            >
              <div className="flex gap-4 p-4">
                {/* Rank */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50 font-bold text-xl border-2 border-border group-hover:border-primary transition-colors">
                    #{game.rank}
                  </div>
                  {game.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-green-500 mt-1" />
                  )}
                </div>

                {/* Image */}
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  {game.discount > 0 && (
                    <Badge className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs">
                      -{game.discount}%
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                      {game.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">{game.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({game.reviews.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {game.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{game.discountPrice} ₽</span>
                        <span className="text-xs text-muted-foreground line-through">{game.price} ₽</span>
                      </div>
                    ) : (
                      <span className="font-bold">{game.price} ₽</span>
                    )}
                    <Button size="sm" variant="outline" className="text-xs">
                      Купить
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg" className="gap-2 group">
            <Link href="/games?sort=popular">
              Посмотреть весь топ 100
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
