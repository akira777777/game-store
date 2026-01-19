"use client"

import { Card } from "@/components/ui/card"
import { Activity, ShoppingCart, TrendingUp, Users, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export function LiveStatsSection() {
  const [stats, setStats] = useState({
    onlineNow: 8432,
    todaySales: 1247,
    activeCarts: 342,
    lastMinute: 23
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        onlineNow: prev.onlineNow + Math.floor(Math.random() * 20 - 10),
        todaySales: prev.todaySales + Math.floor(Math.random() * 5),
        activeCarts: prev.activeCarts + Math.floor(Math.random() * 10 - 5),
        lastMinute: Math.floor(Math.random() * 30 + 10)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Card className="group relative p-6 text-center border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <Activity className="h-8 w-8 mx-auto mb-3 text-green-500 animate-pulse" />
              <div className="text-3xl font-bold mb-1 text-foreground tabular-nums">{stats.onlineNow.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Сейчас онлайн</p>
            </div>
          </Card>

          <Card className="group relative p-6 text-center border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <div className="text-3xl font-bold mb-1 text-foreground tabular-nums">{stats.todaySales.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Продаж сегодня</p>
            </div>
          </Card>

          <Card className="group relative p-6 text-center border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <ShoppingCart className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <div className="text-3xl font-bold mb-1 text-foreground tabular-nums">{stats.activeCarts.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Активных корзин</p>
            </div>
          </Card>

          <Card className="group relative p-6 text-center border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <Zap className="h-8 w-8 mx-auto mb-3 text-orange-500 animate-pulse" />
              <div className="text-3xl font-bold mb-1 text-foreground tabular-nums">{stats.lastMinute}</div>
              <p className="text-sm text-muted-foreground">Покупок/минуту</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
