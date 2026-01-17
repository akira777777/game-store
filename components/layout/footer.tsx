import Link from "next/link"
import { Gamepad2, Headphones, Mail, Phone, ShieldCheck } from "lucide-react"

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
    <footer className="border-t bg-background/95">
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Gamepad2 className="h-5 w-5 text-primary" aria-hidden="true" />
              Game Store
            </Link>
            <p className="text-sm text-muted-foreground">
              Современный маркетплейс видеоигр с быстрым доступом к цифровым копиям
              и проверенными релизами.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Платежи защищены и обрабатываются мгновенно
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Каталог
            </p>
            <ul className="space-y-2 text-sm">
              {footerLinks.catalog.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Аккаунт
            </p>
            <ul className="space-y-2 text-sm">
              {footerLinks.account.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Поддержка
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href="mailto:support@gamestore.dev" className="hover:text-foreground">
                  support@gamestore.dev
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href="tel:+78005553535" className="hover:text-foreground">
                  +7 (800) 555-35-35
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-primary" aria-hidden="true" />
                Круглосуточная помощь
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Game Store. Все права защищены.</p>
          <p>Публичная оферта и политика возврата доступны через поддержку.</p>
        </div>
      </div>
    </footer>
  )
}
