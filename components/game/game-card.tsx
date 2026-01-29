import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { parseJsonArrayOrString } from "@/lib/game-utils"
import { Game } from "@/lib/mock-data"
import Image from "next/image"
import Link from "next/link"
import { memo, useMemo } from "react"

interface GameCardProps {
  game: Game
}

function GameCardComponent({ game }: GameCardProps) {
  const { finalPrice, hasDiscount, discountPercent, images, genres } = useMemo(() => {
    const finalPrice = game.discountPrice || game.price
    const hasDiscount = !!game.discountPrice
    const discountPercent = hasDiscount && game.price > 0
      ? Math.round(((game.price - (game.discountPrice || 0)) / game.price) * 100)
      : 0
    const images = parseJsonArrayOrString(game.images)
    const genres = parseJsonArrayOrString(game.genres)

    return { finalPrice, hasDiscount, discountPercent, images, genres }
  }, [game.discountPrice, game.price, game.images, game.genres])

  return (
    <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 group border-border/50 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />

      <Link href={`/games/${game.slug}`} aria-label={`Подробнее о игре ${game.title}`}>
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
          {images.length > 0 ? (
            <>
              <Image
                src={images[0]}
                alt={`Обложка игры ${game.title}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" aria-hidden="true" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50" aria-hidden="true">
              <span className="text-sm">Нет изображения</span>
            </div>
          )}
          {hasDiscount && discountPercent > 0 && (
            <Badge
              className="absolute top-3 right-3 shadow-lg animate-pulse z-10 border-2 border-background/50"
              variant="destructive"
              aria-label={`Скидка ${discountPercent}%`}
            >
              <span className="relative z-10">-{discountPercent}%</span>
              <div className="absolute inset-0 bg-destructive/50 blur-md -z-10 animate-pulse" aria-hidden="true" />
            </Badge>
          )}
        </div>
      </Link>
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors duration-300 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text group-hover:from-primary group-hover:to-primary/80">
          {game.title}
        </CardTitle>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Жанры игры">
            {genres.slice(0, 2).map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                role="listitem"
                className="text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300"
              >
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1 leading-relaxed">
          {game.description}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-destructive">
                  ${finalPrice !== null && finalPrice !== undefined ? finalPrice.toString() : '0'}
                </span>
                <span className="text-sm line-through text-muted-foreground">
                  ${game.price !== null && game.price !== undefined ? game.price.toString() : '0'}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-foreground">
                ${finalPrice !== null && finalPrice !== undefined ? finalPrice.toString() : '0'}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 relative z-10">
        <Link href={`/games/${game.slug}`} className="w-full group" aria-label={`Перейти на страницу игры ${game.title}`}>
          <Button
            className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/90 group-hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 relative overflow-hidden"
            aria-label={`Подробнее о игре ${game.title}`}
          >
            <span className="relative z-10">Подробнее</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export const GameCard = memo(GameCardComponent, (prevProps, nextProps) => {
  return prevProps.game.id === nextProps.game.id &&
    prevProps.game.price === nextProps.game.price &&
    prevProps.game.discountPrice === nextProps.game.discountPrice &&
    prevProps.game.images === nextProps.game.images &&
    prevProps.game.title === nextProps.game.title &&
    prevProps.game.description === nextProps.game.description &&
    prevProps.game.genres === nextProps.game.genres
})
