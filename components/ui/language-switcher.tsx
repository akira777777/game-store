"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales, type Locale } from "@/i18n"
import { Languages } from "lucide-react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return
    
    startTransition(() => {
      // Get current path without locale prefix
      const segments = pathname.split('/').filter(Boolean)
      const currentLocaleIndex = locales.indexOf(segments[0] as Locale)
      
      // Remove locale from path if present
      const pathWithoutLocale = currentLocaleIndex !== -1 
        ? '/' + segments.slice(1).join('/') 
        : pathname
      
      // Build new path with new locale
      const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
      
      router.push(newPath)
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          aria-label="Switch language"
          disabled={isPending}
        >
          <Languages className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            disabled={isPending || locale === loc}
            className={locale === loc ? "bg-accent" : ""}
          >
            {localeNames[loc]}
            {locale === loc && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
