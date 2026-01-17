import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { parseJsonArrayOrString } from "@/lib/game-utils"
import { Game } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const finalPrice = game.discountPrice || game.price
  const hasDiscount = !!game.discountPrice
  const images = parseJsonArrayOrString(game.images)
  const genres = parseJsonArrayOrString(game.genres)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/games/${game.slug}`} aria-label={`Подробнее о игре ${game.title}`}>
        <div className="relative aspect-video w-full bg-muted">
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={`Обложка игры ${game.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground" aria-hidden="true">
              Нет изображения
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 right-2" variant="destructive" aria-label="Игра со скидкой">
              Скидка
            </Badge>
          )}
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="line-clamp-2">{game.title}</CardTitle>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Жанры игры">
            {genres.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="secondary" role="listitem">
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {game.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount ? (
              <div>
                <span className="text-2xl font-bold text-destructive">
                  ${finalPrice.toString()}
                </span>
                <span className="ml-2 text-sm line-through text-muted-foreground">
                  ${game.price.toString()}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">${finalPrice.toString()}</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/games/${game.slug}`} className="w-full" aria-label={`Перейти на страницу игры ${game.title}`}>
          <Button className="w-full" aria-label={`Подробнее о игре ${game.title}`}>Подробнее</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
