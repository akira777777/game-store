"use client"

import { GameCard } from "@/components/game/game-card"
import { ViewToggle } from "@/components/game/view-toggle"
import { parseJsonArrayOrString } from "@/lib/game-utils"
import { Game } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface GamesListProps {
  games: (Game & {
    genres?: string[]
    platforms?: string[]
  })[]
  total: number
}

export function GamesList({ games, total }: GamesListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Показано <span className="font-semibold text-foreground">{games.length}</span> из{" "}
          <span className="font-semibold text-foreground">{total}</span> игр
        </p>
        <ViewToggle onViewChange={setViewMode} />
      </div>

      {viewMode === "grid" ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          role="list"
          aria-label={`Список игр, найдено ${games.length}`}
        >
          {games.map((game) => (
            <article key={game.id} role="listitem">
              <GameCard game={game} />
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-8" role="list" aria-label={`Список игр, найдено ${games.length}`}>
          {games.map((game) => {
            const images = parseJsonArrayOrString(game.images)
            const platforms = parseJsonArrayOrString(game.platforms)
            const finalPrice = game.discountPrice || game.price
            const hasDiscount = !!game.discountPrice

            return (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <article
                  role="listitem"
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                      {images.length > 0 ? (
                        <Image
                          src={images[0]}
                          alt={`Обложка ${game.title}`}
                          fill
                          className="object-cover"
                          sizes="128px"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          Нет изображения
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{game.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {platforms.length > 0 && <span>{platforms.slice(0, 2).join(", ")}</span>}
                          {game.releaseDate && (
                            <span>
                              {new Date(game.releaseDate).toLocaleDateString("ru-RU", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {hasDiscount ? (
                            <div>
                              <span className="text-xl font-bold text-destructive">${finalPrice.toFixed(2)}</span>
                              <span className="ml-2 text-sm line-through text-muted-foreground">
                                ${game.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold">${finalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
