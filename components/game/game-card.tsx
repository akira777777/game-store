import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { parseJsonArrayOrString } from "@/lib/game-utils"
import { Game } from "@prisma/client"
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
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 group border-border/50 bg-background/50 backdrop-blur-sm">
      <Link href={`/games/${game.slug}`} aria-label={`Подробнее о игре ${game.title}`}>
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
          {images.length > 0 ? (
            <>
              <Image
                src={images[0]}
                alt={`Обложка игры ${game.title}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50" aria-hidden="true">
              <span className="text-sm">Нет изображения</span>
            </div>
          )}
          {hasDiscount && discountPercent > 0 && (
            <Badge
              className="absolute top-3 right-3 shadow-lg animate-pulse"
              variant="destructive"
              aria-label={`Скидка ${discountPercent}%`}
            >
              -{discountPercent}%
            </Badge>
          )}
        </div>
      </Link>
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors duration-300">
          {game.title}
        </CardTitle>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Жанры игры">
            {genres.slice(0, 2).map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                role="listitem"
                className="text-xs"
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
      <CardFooter className="pt-0">
        <Link href={`/games/${game.slug}`} className="w-full" aria-label={`Перейти на страницу игры ${game.title}`}>
          <Button
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label={`Подробнее о игре ${game.title}`}
          >
            Подробнее
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
