import Link from "next/link"
import Image from "next/image"
import { Game } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { parseJsonArrayOrString } from "@/lib/game-utils"

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
      <Link href={`/games/${game.slug}`}>
        <div className="relative aspect-video w-full bg-muted">
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={game.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Нет изображения
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 right-2" variant="destructive">
              Скидка
            </Badge>
          )}
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="line-clamp-2">{game.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
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
        <Link href={`/games/${game.slug}`} className="w-full">
          <Button className="w-full">Подробнее</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
