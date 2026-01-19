"use client"

import { Card } from "@/components/ui/card"
import { Award, CheckCircle2, Shield, Sparkles, TrendingUp, Zap } from "lucide-react"

const partners = [
  { name: "Steam", logo: "🎮", description: "Официальный партнёр", verified: true },
  { name: "Epic Games", logo: "🎯", description: "Сертифицированный дилер", verified: true },
  { name: "Ubisoft", logo: "🌟", description: "Авторизованный партнёр", verified: true },
  { name: "EA", logo: "⚡", description: "Прямые поставки", verified: true },
  { name: "Activision", logo: "🔥", description: "Официальный дистрибьютор", verified: true },
  { name: "PlayStation", logo: "🎪", description: "Лицензированный партнёр", verified: true },
  { name: "Xbox", logo: "🎨", description: "Официальный ритейлер", verified: true },
  { name: "Nintendo", logo: "🌈", description: "Авторизованный продавец", verified: true },
]

const features = [
  {
    icon: Shield,
    title: "Официальные ключи",
    description: "Все ключи от издателей",
    color: "from-blue-500/20 to-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500/10 to-blue-500/5"
  },
  {
    icon: CheckCircle2,
    title: "Гарантия качества",
    description: "100% работоспособность",
    color: "from-green-500/20 to-green-500/10",
    iconColor: "text-green-600 dark:text-green-400",
    gradient: "from-green-500/10 to-green-500/5"
  },
  {
    icon: Award,
    title: "Награды индустрии",
    description: "Лучший ритейлер 2024",
    color: "from-yellow-500/20 to-yellow-500/10",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    gradient: "from-yellow-500/10 to-yellow-500/5"
  },
  {
    icon: Sparkles,
    title: "Premium сервис",
    description: "VIP поддержка 24/7",
    color: "from-purple-500/20 to-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500/10 to-purple-500/5"
  },
]

export function PartnersSection() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-background via-primary/[0.02] to-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" aria-hidden="true" />
        <div className="absolute bottom-1/2 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-4 hover:scale-105 transition-transform duration-300">
            <Award className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Доверенный партнёр</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Работаем с{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
              ведущими издателями
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Официальное партнёрство с крупнейшими игровыми компаниями мира гарантирует подлинность и качество
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-16">
          {partners.map((partner, index) => (
            <Card
              key={partner.name}
              className="group relative p-6 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md overflow-hidden animate-scale-in"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: `${index * 0.2}s` }} aria-hidden="true">
                  {partner.logo}
                </div>

                {/* Name */}
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {partner.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors mb-3">
                  {partner.description}
                </p>

                {/* Verified Badge */}
                {partner.verified && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Verified</span>
                  </div>
                )}
              </div>

              {/* Sparkle effect on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
              </div>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Background glow */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} aria-hidden="true" />

              <div className="relative z-10 space-y-3">
                {/* Icon */}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} aria-hidden="true" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="relative">
          <div className="flex flex-wrap items-center justify-center gap-6 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-md hover:border-primary/30 transition-all duration-300">
            {/* ISO Certification */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Сертифицировано</p>
                <p className="text-xs text-muted-foreground">ISO 9001:2015</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" aria-hidden="true" />

            {/* Verified Seller */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500/30 to-green-500/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Verified Seller</p>
                <p className="text-xs text-muted-foreground">Since 2020</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" aria-hidden="true" />

            {/* Best Retailer Award */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/30 to-yellow-500/10 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Best Retailer</p>
                <p className="text-xs text-muted-foreground">2024 Award</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden lg:block" aria-hidden="true" />

            {/* Fastest Growing */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/30 to-orange-500/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Fastest Growing</p>
                <p className="text-xs text-muted-foreground">+250% YoY</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden lg:block" aria-hidden="true" />

            {/* Lightning Delivery */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-cyan-600 dark:text-cyan-400 group-hover:animate-pulse" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Instant Delivery</p>
                <p className="text-xs text-muted-foreground">&lt;60 seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
