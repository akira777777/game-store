import { Button } from "@/components/ui/button"
import { ArrowRight, Gamepad2, Headset, ShieldCheck, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 to-background py-16 sm:py-24 lg:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse" aria-hidden="true" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse delay-1000" aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 backdrop-blur-sm px-5 py-2.5 text-sm shadow-lg animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
            <span className="font-medium text-foreground">
              Новые игры каждый день
            </span>
          </div>

          {/* Main heading */}
          <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl animate-fade-in">
            <span className="inline-block mb-2">Откройте мир</span>
            <br />
            <span className="inline-block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
              видеоигр
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Современный интернет-магазин с лучшими играми для всех платформ.
            <br className="hidden sm:block" />
            <span className="text-foreground font-medium">Эксклюзивные скидки</span> и мгновенная доставка цифровых копий.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-16 animate-fade-in">
            <Button
              asChild
              size="lg"
              className="group text-base sm:text-lg px-8 sm:px-10 py-7 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              aria-label="Перейти в каталог игр"
            >
              <Link href="/games">
                Перейти в каталог
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-8 sm:px-10 py-7 w-full sm:w-auto border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105"
              aria-label="Открыть популярные игры"
            >
              <Link href="/games?featured=true">
                <Gamepad2 className="mr-2 h-5 w-5" aria-hidden="true" />
                Популярные игры
              </Link>
            </Button>
          </div>

          {/* Features grid */}
          <ul className="mt-12 grid gap-6 sm:grid-cols-3 text-left mb-16" aria-label="Преимущества магазина">
            <li className="group rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold">Мгновенная доставка</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ключи приходят на почту сразу после оплаты.
              </p>
            </li>
            <li className="group rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold">Безопасная оплата</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Современные методы защиты и прозрачные чеки.
              </p>
            </li>
            <li className="group rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Headset className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold">Поддержка 24/7</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ответим на любые вопросы в чате или по почте.
              </p>
            </li>
          </ul>

          {/* Stats */}
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            <div className="space-y-2">
              <dt className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                1000+
              </dt>
              <dd className="text-sm sm:text-base text-muted-foreground font-medium">Игр в каталоге</dd>
            </div>
            <div className="space-y-2">
              <dt className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                50K+
              </dt>
              <dd className="text-sm sm:text-base text-muted-foreground font-medium">Довольных клиентов</dd>
            </div>
            <div className="space-y-2">
              <dt className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                24/7
              </dt>
              <dd className="text-sm sm:text-base text-muted-foreground font-medium">Поддержка</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
