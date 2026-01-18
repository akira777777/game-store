"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Cookie } from "lucide-react"
import { useEffect, useState } from "react"

const COOKIE_CONSENT_KEY = "cookie-consent"

type ConsentStatus = "accepted" | "rejected" | null

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Проверяем, есть ли уже сохраненное согласие
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus
    if (!consent) {
      // Небольшая задержка для плавного появления
      const timer = setTimeout(() => {
        setShowBanner(true)
        setIsAnimating(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setIsAnimating(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected")
    setIsAnimating(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  // Не рендерим до монтирования, чтобы избежать проблем с гидратацией
  if (!mounted || !showBanner) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 w-full p-4 transition-all duration-300 ease-in-out",
        isAnimating
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      )}
      role="dialog"
      aria-label="Согласие на использование cookies"
      aria-modal="true"
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border bg-card/95 backdrop-blur-md p-4 shadow-xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="flex-1">
                <h3 className="mb-1.5 text-sm font-semibold">
                  Использование cookies
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Мы используем cookies для улучшения работы сайта, анализа
                  трафика и персонализации контента. Продолжая использовать
                  сайт, вы соглашаетесь с использованием cookies.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 sm:flex-col sm:gap-2">
              <Button
                onClick={handleAccept}
                size="sm"
                className="w-full sm:w-24"
              >
                Согласен
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                size="sm"
                className="w-full sm:w-24"
              >
                Нет
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
