import { Gamepad2, Headphones, Mail, Phone, ShieldCheck } from "lucide-react"
import Link from "next/link"

const footerLinks = {
  catalog: [
    { label: "Каталог игр", href: "/games" },
    { label: "Рекомендуемые", href: "/games?featured=true" },
    { label: "Новинки", href: "/games?sort=newest" },
    { label: "Сначала дешевле", href: "/games?sort=price_asc" },
  ],
  account: [
    { label: "Корзина", href: "/cart" },
    { label: "Профиль", href: "/profile" },
    { label: "Войти", href: "/login" },
    { label: "Регистрация", href: "/register" },
  ],
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary">
              <Gamepad2 className="h-5 w-5 text-primary transition-transform duration-300 hover:rotate-12" aria-hidden="true" />
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Game Store</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Современный маркетплейс видеоигр с быстрым доступом к цифровым копиям
              и проверенными релизами.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-primary/5 border border-primary/10">
              <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
              <span>Платежи защищены и обрабатываются мгновенно</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Каталог
            </p>
            <ul className="space-y-3 text-sm">
              {footerLinks.catalog.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 inline-block hover:translate-x-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Аккаунт
            </p>
            <ul className="space-y-3 text-sm">
              {footerLinks.account.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 inline-block hover:translate-x-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Поддержка
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 group">
                <Mail className="h-4 w-4 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                <a href="mailto:support@gamestore.dev" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  support@gamestore.dev
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="h-4 w-4 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                <a href="tel:+78005553535" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  +7 (800) 555-35-35
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Headphones className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground">Круглосуточная помощь</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/50 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">© {year} Game Store. Все права защищены.</p>
          <p>Публичная оферта и политика возврата доступны через поддержку.</p>
        </div>
      </div>
    </footer>
  )
}
