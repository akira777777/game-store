"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Bell, Star, ArrowRight, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const upcomingReleases = [
  {
    id: 1,
    title: "GTA VI",
    releaseDate: "2026-11-15",
    preOrder: true,
    price: 5999,
    preOrderDiscount: 10,
    platforms: ["PC", "PS5", "Xbox"],
    hypeLevel: "extreme",
    wishlisted: 2500000,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 2,
    title: "The Elder Scrolls VI",
    releaseDate: "2027-03-20",
    preOrder: false,
    price: 4999,
    platforms: ["PC", "Xbox"],
    hypeLevel: "high",
    wishlisted: 1800000,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=800&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Fable",
    releaseDate: "2026-10-10",
    preOrder: true,
    price: 3999,
    preOrderDiscount: 15,
    platforms: ["PC", "Xbox"],
    hypeLevel: "high",
    wishlisted: 950000,
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&h=800&fit=crop&q=80",
  },
]

function calculateDaysUntil(releaseDate: string): number {
  const now = new Date()
  const release = new Date(releaseDate)
  const diffTime = release.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function UpcomingReleasesSection() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-background via-blue-500/[0.02] to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Скоро выйдут</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Календарь{" "}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                релизов
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Самые ожидаемые игры 2025-2026. Оформите предзаказ со скидкой до 15%!
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="gap-2 group">
            <Link href="/games?category=upcoming">
              Все анонсы
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingReleases.map((game, index) => (
            <Card key={game.id} className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative aspect-[3/4] bg-muted">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
                <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-lg bg-background/90 backdrop-blur-md border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">До релиза:</p>
                  <p className="text-2xl font-bold text-primary">{calculateDaysUntil(game.releaseDate)} дней</p>
                </div>
                {game.preOrder && (
                  <Badge className="absolute top-4 right-4 z-20 bg-green-500 text-white">Предзаказ</Badge>
                )}
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{game.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(game.releaseDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bell className="h-4 w-4" />
                  <span>{game.wishlisted.toLocaleString()} в желаемом</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xl font-bold">{game.price} ₽</span>
                  {game.preOrder ? (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">Предзаказ</Button>
                  ) : (
                    <Button size="sm" variant="outline">Уведомить</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
