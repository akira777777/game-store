"use client"

import { GameCardSkeleton } from "./game-card-skeleton"
import { Game } from "@prisma/client"
import { useTranslations } from "next-intl"
import { memo } from "react"
import { GameCard } from "./game-card"

interface GameGridProps {
  games: Game[]
  isLoading?: boolean
}

function GameGridComponent({ games, isLoading = false }: GameGridProps) {
  const t = useTranslations("components.gameGrid")

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <GameCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
        <div className="mb-4 rounded-full bg-muted p-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">
          {t("noGamesFound")}
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t("tryChangingFilters")}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game, index) => (
        <div
          key={game.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${Math.min(index * 0.05, 0.3)}s`,
          }}
        >
          <GameCard game={game} />
        </div>
      ))}
    </div>
  )
}

export const GameGrid = memo(GameGridComponent)
