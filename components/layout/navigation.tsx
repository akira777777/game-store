"use client"

import { SearchBar } from "@/components/layout/search-bar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CreditCard, Flame, Gamepad2, LogOut, Menu, Shield, ShoppingCart, Sparkles, User, X } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Navigation() {
  const { data: session } = useSession()
  const t = useTranslations("nav")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isGamesActive = pathname.includes("/games")
  const isCartActive = pathname.includes("/cart")
  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || session?.user?.email?.[0].toUpperCase() || "?"

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm" aria-label={t("mainNavigation")}>
      {/* Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold transition-all duration-300 hover:text-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md group shrink-0"
            aria-label={`${t("home")} Game Store`}
          >
            <div className="relative">
              <Gamepad2 className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12 relative z-10" aria-hidden="true" />
              <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" aria-hidden="true" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">Game Store</span>
          </Link>

          {/* Search Bar - Desktop */}
          <SearchBar />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 shrink-0" role="navigation" aria-label={t("mainSections")}>
            <Button
              asChild
              variant={isGamesActive ? "secondary" : "ghost"}
              className="gap-2 transition-all duration-300 hover:scale-105 relative group"
              aria-current={isGamesActive ? "page" : undefined}
            >
              <Link href="/games" aria-label={t("catalog")} className="relative z-10">
                <Menu className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" aria-hidden="true" />
                {t("catalog")}
                {isGamesActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-md -z-10" aria-hidden="true" />
                )}
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname.includes("/payment-cards") ? "secondary" : "ghost"}
              className="gap-2 transition-all duration-300 hover:scale-105 relative group"
              aria-current={pathname.includes("/payment-cards") ? "page" : undefined}
            >
              <Link href="/payment-cards" className="relative z-10">
                <CreditCard className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" aria-hidden="true" />
                Cards
                {pathname.includes("/payment-cards") && (
                  <div className="absolute inset-0 bg-primary/10 rounded-md -z-10" aria-hidden="true" />
                )}
              </Link>
            </Button>
            <Button
              asChild
              variant={isCartActive ? "secondary" : "ghost"}
              className="gap-2 relative transition-all duration-300 hover:scale-105 group"
              aria-current={isCartActive ? "page" : undefined}
            >
              <Link href="/cart" aria-label={t("cart")} className="relative z-10">
                <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" aria-hidden="true" />
                <span className="hidden lg:inline">{t("cart")}</span>
                {isCartActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-md -z-10" aria-hidden="true" />
                )}
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    aria-label={t("userMenu")}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name || session.user?.email || t("user")} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name || t("user")}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4" aria-hidden="true" />
                      {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        {t("admin")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:flex">
                  <Link href="/login">{t("login")}</Link>
                </Button>
                <Button asChild className="hidden sm:flex">
                  <Link href="/register">{t("register")}</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t bg-background"
            role="navigation"
            aria-label={t("mobileMenu")}
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Search Bar - Mobile */}
              <div className="pb-2">
                <SearchBar variant="mobile" />
              </div>
              <Link
                href="/games"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isGamesActive ? "bg-accent text-accent-foreground" : "hover:bg-accent"}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isGamesActive ? "page" : undefined}
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
                {t("catalog")}
              </Link>
              <Link
                href="/payment-cards"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${pathname.includes("/payment-cards") ? "bg-accent text-accent-foreground" : "hover:bg-accent"}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname.includes("/payment-cards") ? "page" : undefined}
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Cards
              </Link>
              <Link
                href="/games?sort=newest"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {t("newGames")}
              </Link>
              <Link
                href="/games?sort=price_asc"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                {t("discounts")}
              </Link>
              <Link
                href="/cart"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isCartActive ? "bg-accent text-accent-foreground" : "hover:bg-accent"}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isCartActive ? "page" : undefined}
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                {t("cart")}
              </Link>
              <div className="px-4 py-2 flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              {session ? (
                <>
                  <div className="border-t my-2 pt-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      {t("profile")}
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        {t("admin")}
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    {t("logout")}
                  </button>
                </>
              ) : (
                <div className="border-t my-2 pt-2 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-2 rounded-md hover:bg-accent transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("register")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}