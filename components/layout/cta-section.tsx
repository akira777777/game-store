import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border bg-primary/5 p-6 sm:p-10"
      aria-labelledby="cta-heading"
    >
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Лучшие предложения недели
          </div>
          <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-balance">
            Готовы выбрать новую игру?
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Откройте каталог, сравните цены и получите доступ к игре за пару минут.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/games" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Перейти в каталог
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Создать аккаунт
            </Button>
          </Link>
        </div>
      </div>
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
        aria-hidden="true"
      />
    </section>
  )
}
