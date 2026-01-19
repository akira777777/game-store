import { Facebook, Gamepad2, Headphones, Instagram, Mail, MessageCircle, Phone, ShieldCheck, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

const footerLinks = {
  catalog: [
    { label: "Каталог игр", href: "/games" },
    { label: "Рекомендуемые", href: "/games?featured=true" },
    { label: "Новинки", href: "/games?sort=newest" },
    { label: "Со скидкой", href: "/games?sort=price_asc" },
    { label: "Предзаказы", href: "/games?preorder=true" },
    { label: "Топ продаж", href: "/games?sort=popular" },
  ],
  account: [
    { label: "Корзина", href: "/cart" },
    { label: "Профиль", href: "#" }, // TODO: Create /profile page
    { label: "История заказов", href: "#" }, // TODO: Create /orders page
    { label: "Список желаний", href: "#" }, // TODO: Create /wishlist page
    { label: "Войти", href: "/login" },
    { label: "Регистрация", href: "/register" },
  ],
  company: [
    { label: "О компании", href: "#" }, // TODO: Create /about page
    { label: "Вакансии", href: "#" }, // TODO: Create /careers page
    { label: "Блог", href: "#" }, // TODO: Create /blog page
    { label: "Партнёрам", href: "#" }, // TODO: Create /partners page
    { label: "Пресс-центр", href: "#" }, // TODO: Create /press page
  ],
  legal: [
    { label: "Пользовательское соглашение", href: "#" }, // TODO: Create /terms page
    { label: "Политика конфиденциальности", href: "#" }, // TODO: Create /privacy page
    { label: "Политика возврата", href: "#" }, // TODO: Create /refund page
    { label: "Cookie", href: "#" }, // TODO: Create /cookies page
    { label: "GDPR", href: "#" }, // TODO: Create /gdpr page
  ],
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-background/95 to-background backdrop-blur-sm">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold transition-all duration-300 hover:text-primary hover:scale-105 group">
              <div className="relative">
                <Gamepad2 className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12 relative z-10" aria-hidden="true" />
                <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" aria-hidden="true" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">Game Store</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Современный маркетплейс видеоигр с быстрым доступом к цифровым копиям
              и проверенными релизами. Более 50,000 довольных геймеров!
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
              <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
              <span className="group-hover:text-foreground transition-colors">Платежи защищены SSL</span>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
                Мы в соцсетях
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-500" },
                  { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
                  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
                  { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-500" },
                  { icon: MessageCircle, href: "#", label: "Discord", color: "hover:text-indigo-500" },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg group ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
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
                    className="text-muted-foreground hover:text-primary transition-all duration-300 inline-block hover:translate-x-1 group relative"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" aria-hidden="true" />
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
                    className="text-muted-foreground hover:text-primary transition-all duration-300 inline-block hover:translate-x-1 group relative"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Компания
            </p>
            <ul className="space-y-3 text-sm">
              {footerLinks.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 inline-block hover:translate-x-1 group relative"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Документы
            </p>
            <ul className="space-y-3 text-sm">
              {footerLinks.legal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 inline-block hover:translate-x-1 group relative"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" aria-hidden="true" />
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
                <div className="relative">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10" aria-hidden="true" />
                  <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" aria-hidden="true" />
                </div>
                <a href="mailto:artemmikhailov20031001@gmail.com" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group/link break-all">
                  support@gamestore.com
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover/link:w-full transition-all duration-300" aria-hidden="true" />
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="relative">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10" aria-hidden="true" />
                  <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" aria-hidden="true" />
                </div>
                <a href="tel:+420737500587" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group/link">
                  +420 737 500 587
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover/link:w-full transition-all duration-300" aria-hidden="true" />
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="relative">
                  <Headphones className="h-4 w-4 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10" aria-hidden="true" />
                  <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" aria-hidden="true" />
                </div>
                <span className="text-muted-foreground group-hover:text-primary transition-colors duration-300">24/7 Онлайн чат</span>
              </li>
              <li className="pt-2">
                <Link href="/help" className="text-primary hover:underline text-sm font-medium">
                  Центр помощи →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border/50 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <p className="font-medium">
                © {year} Game Store. Все права защищены.
              </p>
              <p className="text-xs">
                Created by <span className="font-semibold text-primary">Artem Mikhailov</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/terms" className="hover:text-primary transition-colors">Условия использования</Link>
              <span className="text-border">•</span>
              <Link href="/privacy" className="hover:text-primary transition-colors">Конфиденциальность</Link>
              <span className="text-border">•</span>
              <Link href="/sitemap" className="hover:text-primary transition-colors">Карта сайта</Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-muted-foreground/70 space-y-1">
            <p>
              Game Store является зарегистрированной торговой маркой. Все торговые марки принадлежат их владельцам.
            </p>
            <p>
              Цифровые ключи предоставляются официальными издателями и дистрибьюторами.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
