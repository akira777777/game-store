import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gamepad2, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-background to-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              Новые игры каждый день
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="inline-block">Откройте мир</span>
            <br />
            <span className="inline-block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              видеоигр
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl lg:text-2xl">
            Современный интернет-магазин с лучшими играми для всех платформ.
            Эксклюзивные скидки и мгновенная доставка цифровых копий.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/games">
              <Button size="lg" className="group text-lg px-8 py-6">
                Перейти в каталог
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/games?featured=true">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Популярные игры
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Игр в каталоге</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Довольных клиентов</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Поддержка</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
    </section>
  )
}
