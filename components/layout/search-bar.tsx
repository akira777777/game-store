"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface SearchBarProps {
  className?: string
  variant?: "default" | "mobile"
}

export function SearchBar({ className, variant = "default" }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Получаем текущий поисковый запрос из URL и обновляем при изменении
  useEffect(() => {
    const currentSearch = searchParams.get("search") || ""
    setSearchQuery(currentSearch)
  }, [searchParams])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmedQuery = searchQuery.trim()

    if (trimmedQuery) {
      router.push(`/games?search=${encodeURIComponent(trimmedQuery)}`)
    } else {
      router.push("/games")
    }

    // Снимаем фокус с инпута
    inputRef.current?.blur()
  }

  const handleClear = () => {
    setSearchQuery("")
    inputRef.current?.focus()
    // Если мы на странице игр, очищаем поиск
    if (pathname === "/games") {
      router.push("/games")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
    if (e.key === "Escape") {
      inputRef.current?.blur()
      setIsFocused(false)
    }
  }

  if (variant === "mobile") {
    return (
      <form onSubmit={handleSearch} className={cn("w-full", className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Поиск игр..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={handleClear}
              aria-label="Очистить поиск"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "relative hidden md:flex items-center gap-2 max-w-md flex-1",
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Поиск игр..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full pl-9 pr-9 transition-all",
            isFocused && "ring-2 ring-ring ring-offset-2"
          )}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 hover:bg-transparent"
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        type="submit"
        size="sm"
        className="shrink-0"
        aria-label="Выполнить поиск"
      >
        Найти
      </Button>
    </form>
  )
}
