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

        {/* Payment Methods Section */}
        <div className="mt-12 border-t border-border/50 pt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Способы оплаты
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {/* PayPal */}
            <div className="flex items-center justify-center rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
              <svg
                className="h-8 w-auto"
                viewBox="0 0 120 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="PayPal"
              >
                <path
                  d="M25.5 8.5c-1.5 0-2.8.5-3.8 1.5-1 1-1.5 2.3-1.5 3.8v8.5c0 1.5.5 2.8 1.5 3.8 1 1 2.3 1.5 3.8 1.5h2.5c.3 0 .5-.2.5-.5v-1c0-.3-.2-.5-.5-.5h-2.5c-1 0-1.8-.3-2.5-1-.7-.7-1-1.5-1-2.5v-8.5c0-1 .3-1.8 1-2.5.7-.7 1.5-1 2.5-1h2.5c.3 0 .5-.2.5-.5v-1c0-.3-.2-.5-.5-.5h-2.5z"
                  fill="#003087"
                />
                <path
                  d="M35 8.5c-1.5 0-2.8.5-3.8 1.5-1 1-1.5 2.3-1.5 3.8v8.5c0 1.5.5 2.8 1.5 3.8 1 1 2.3 1.5 3.8 1.5h2.5c.3 0 .5-.2.5-.5v-1c0-.3-.2-.5-.5-.5h-2.5c-1 0-1.8-.3-2.5-1-.7-.7-1-1.5-1-2.5v-8.5c0-1 .3-1.8 1-2.5.7-.7 1.5-1 2.5-1h2.5c.3 0 .5-.2.5-.5v-1c0-.3-.2-.5-.5-.5h-2.5z"
                  fill="#009CDE"
                />
                <text x="15" y="21" fontSize="13" fontWeight="bold" fill="#003087">
                  PayPal
                </text>
              </svg>
            </div>

            {/* Visa */}
            <div className="flex items-center justify-center rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
              <svg
                className="h-8 w-auto"
                viewBox="0 0 120 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Visa"
              >
                <path
                  d="M42.5 9.5l-2.5 9h-2.5l2.5-9h2.5zm-8.5 0l-3.5 6.2-1.5-5.2c-.2-.5-.7-.8-1.2-.8h-5.5l-.1.5c1 .2 2.1.6 2.8 1l2.5 6.5 6.5-13h3l-8.5 9zm20.5 0h-2.3c-.7 0-1.2.4-1.4 1l-4.5 8h2.8l.6-1.5h3.5l.4 1.5h2.5l-2.1-9zm-2.8 5.5l1.5-4-1.1 4h-1.4zm12.5-5.5l-2.5 9h-2.3l2.5-9h2.3z"
                  fill="#1434CB"
                />
                <text x="60" y="21" fontSize="18" fontWeight="bold" fill="#1434CB" letterSpacing="3">
                  VISA
                </text>
              </svg>
            </div>

            {/* MasterCard */}
            <div className="flex items-center justify-center rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
              <svg
                className="h-8 w-auto"
                viewBox="0 0 120 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="MasterCard"
              >
                <circle cx="30" cy="16" r="10" fill="#EB001B" />
                <circle cx="40" cy="16" r="10" fill="#F79E1B" />
                <path
                  d="M35 6c-5.5 0-10 4.5-10 10s4.5 10 10 10c2.8 0 5.3-1.2 7-3.1-1.7-1.9-4.2-3.1-7-3.1-3.3 0-6-2.7-6-6s2.7-6 6-6c2.8 0 5.3 1.2 7 3.1-1.7-1.9-4.2-3.1-7-3.1z"
                  fill="#FF5F00"
                />
                <text x="55" y="20" fontSize="11" fontWeight="bold" fill="#1A1F71" letterSpacing="0.5">
                  Mastercard
                </text>
              </svg>
            </div>

            {/* Stripe */}
            <div className="flex items-center justify-center rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
              <svg
                className="h-8 w-auto"
                viewBox="0 0 120 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Stripe"
              >
                <rect width="120" height="32" rx="2" fill="#635BFF" />
                <text x="60" y="21" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="1.5">
                  Stripe
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border/50 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p className="font-medium text-center sm:text-left">
              © {year} Game Store. Все права защищены.
            </p>
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
