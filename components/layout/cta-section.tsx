import { Button } from "@/components/ui/button"
import { ArrowRight, Gift, Sparkles, Star, Zap } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:p-10 shadow-xl"
      aria-labelledby="cta-heading"
    >
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl animate-pulse" aria-hidden="true" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-primary/15 blur-3xl animate-pulse delay-1000" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-4 flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 px-4 py-2 text-xs font-medium text-primary shadow-md backdrop-blur-sm">
            <Sparkles className="h-4 w-4 animate-pulse" aria-hidden="true" />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Лучшие предложения недели
            </span>
          </div>
          <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Готовы выбрать новую игру?
          </h2>
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
            Откройте каталог, сравните цены и получите доступ к игре за пару минут.
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Мгновенная доставка</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Только проверенные игры</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gift className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Эксклюзивные скидки</span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row shrink-0">
          <Link href="/games" className="w-full sm:w-auto group">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              Перейти в каталог
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-6 border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105"
            >
              Создать аккаунт
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
