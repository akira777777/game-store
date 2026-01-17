"use client"

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
import { Flame, Gamepad2, LogOut, Menu, Shield, ShoppingCart, Sparkles, User, X } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Navigation() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isGamesActive = pathname.startsWith("/games")
  const isCartActive = pathname.startsWith("/cart")
  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || session?.user?.email?.[0].toUpperCase() || "?"

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" aria-label="Главная навигация">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
            aria-label="Главная страница Game Store"
          >
            <Gamepad2 className="h-6 w-6" aria-hidden="true" />
            <span className="hidden sm:inline">Game Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2" role="navigation" aria-label="Основные разделы">
            <Button
              asChild
              variant={isGamesActive ? "secondary" : "ghost"}
              className="gap-2"
              aria-current={isGamesActive ? "page" : undefined}
            >
              <Link href="/games" aria-label="Каталог игр">
                <Menu className="h-4 w-4" aria-hidden="true" />
                Каталог
              </Link>
            </Button>
            <Button
              asChild
              variant={isCartActive ? "secondary" : "ghost"}
              className="gap-2 relative"
              aria-current={isCartActive ? "page" : undefined}
            >
              <Link href="/cart" aria-label="Корзина">
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                <span className="hidden lg:inline">Корзина</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    aria-label="Меню пользователя"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name || session.user?.email || "Пользователь"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name || "Пользователь"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4" aria-hidden="true" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        Админ-панель
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
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:flex">
                  <Link href="/login">Войти</Link>
                </Button>
                <Button asChild className="hidden sm:flex">
                  <Link href="/register">Регистрация</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
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
            aria-label="Мобильное меню"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/games"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isGamesActive ? "bg-accent text-accent-foreground" : "hover:bg-accent"}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isGamesActive ? "page" : undefined}
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
                Каталог
              </Link>
              <Link
                href="/games?sort=newest"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Новинки
              </Link>
              <Link
                href="/games?sort=price_asc"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Flame className="h-4 w-4" aria-hidden="true" />
                Скидки
              </Link>
              <Link
                href="/cart"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isCartActive ? "bg-accent text-accent-foreground" : "hover:bg-accent"}`}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isCartActive ? "page" : undefined}
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Корзина
              </Link>
              {session ? (
                <>
                  <div className="border-t my-2 pt-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      Профиль
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" aria-hidden="true" />
                        Админ-панель
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
                    Выйти
                  </button>
                </>
              ) : (
                <div className="border-t my-2 pt-2 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-2 rounded-md hover:bg-accent transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Регистрация
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
