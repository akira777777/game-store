"use client"

import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"

const POPULAR_GENRES = [
  { value: "ACTION", label: "Экшн" },
  { value: "RPG", label: "RPG" },
  { value: "STRATEGY", label: "Стратегии" },
  { value: "ADVENTURE", label: "Приключения" },
  { value: "SHOOTER", label: "Шутеры" },
] as const

const POPULAR_PLATFORMS = [
  { value: "PC", label: "PC" },
  { value: "PLAYSTATION", label: "PlayStation" },
  { value: "XBOX", label: "Xbox" },
  { value: "NINTENDO_SWITCH", label: "Nintendo Switch" },
] as const

export function QuickFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentGenre = searchParams.get("genre")
  const currentPlatform = searchParams.get("platform")

  const applyFilter = (type: "genre" | "platform", value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(type) === value) {
      params.delete(type)
    } else {
      params.set(type, value)
      params.delete("page") // Reset to first page when filtering
    }
    router.push(`/games?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/games")
  }

  const hasActiveFilters = currentGenre || currentPlatform

  return (
    <div className="space-y-4">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Активные фильтры:</span>
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Очистить все
          </button>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium mb-2">Популярные жанры</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_GENRES.map((genre) => (
              <button
                key={genre.value}
                onClick={() => applyFilter("genre", genre.value)}
                aria-pressed={currentGenre === genre.value}
              >
                <Badge
                  variant={currentGenre === genre.value ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                >
                  {genre.label}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Платформы</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PLATFORMS.map((platform) => (
              <button
                key={platform.value}
                onClick={() => applyFilter("platform", platform.value)}
                aria-pressed={currentPlatform === platform.value}
              >
                <Badge
                  variant={currentPlatform === platform.value ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                >
                  {platform.label}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
