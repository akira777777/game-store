import { Button } from "@/components/ui/button"
import { ArrowRight, Gamepad2, Headset, ShieldCheck, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-background to-background py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-muted-foreground">
              Новые игры каждый день
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            <span className="inline-block">Откройте мир</span>
            <br />
            <span className="inline-block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              видеоигр
            </span>
          </h1>

          <p className="mb-8 text-base text-muted-foreground sm:text-lg lg:text-xl">
            Современный интернет-магазин с лучшими играми для всех платформ.
            Эксклюзивные скидки и мгновенная доставка цифровых копий.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group text-base sm:text-lg px-6 sm:px-8 py-6 w-full sm:w-auto"
              aria-label="Перейти в каталог игр"
            >
              <Link href="/games">
                Перейти в каталог
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-6 sm:px-8 py-6 w-full sm:w-auto"
              aria-label="Открыть популярные игры"
            >
              <Link href="/games?featured=true">
                <Gamepad2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Популярные игры
              </Link>
            </Button>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3 text-left" aria-label="Преимущества магазина">
            <li className="rounded-2xl border bg-background/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
                Мгновенная доставка
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Ключи приходят на почту сразу после оплаты.
              </p>
            </li>
            <li className="rounded-2xl border bg-background/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                Безопасная оплата
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Современные методы защиты и прозрачные чеки.
              </p>
            </li>
            <li className="rounded-2xl border bg-background/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Headset className="h-4 w-4 text-primary" aria-hidden="true" />
                Поддержка 24/7
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Ответим на любые вопросы в чате или по почте.
              </p>
            </li>
          </ul>

          <dl className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <dt className="mb-2 text-2xl sm:text-3xl font-bold text-primary">1000+</dt>
              <dd className="text-xs sm:text-sm text-muted-foreground">Игр в каталоге</dd>
            </div>
            <div>
              <dt className="mb-2 text-2xl sm:text-3xl font-bold text-primary">50K+</dt>
              <dd className="text-xs sm:text-sm text-muted-foreground">Довольных клиентов</dd>
            </div>
            <div>
              <dt className="mb-2 text-2xl sm:text-3xl font-bold text-primary">24/7</dt>
              <dd className="text-xs sm:text-sm text-muted-foreground">Поддержка</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Decorative elements - hidden on small screens, positioned to not overlap content */}
      <div className="hidden md:block absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none -z-0" aria-hidden="true" />
      <div className="hidden md:block absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-0" aria-hidden="true" />
    </section>
  )
}
