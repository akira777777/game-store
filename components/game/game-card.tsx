import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { parseJsonArrayOrString, formatPrice } from "@/lib/game-utils"
import { Game } from "@prisma/client"
import Image from "next/image"
import { Link } from "@/lib/navigation"
import { getTranslations } from "next-intl/server"

interface GameCardProps {
  game: Game
}

export async function GameCard({ game }: GameCardProps) {
  const t = await getTranslations("components.gameCard")

  const finalPrice = game.discountPrice || game.price
  const hasDiscount = !!game.discountPrice
  const discountPercent = hasDiscount && game.price > 0
    ? Math.round(((game.price - (game.discountPrice || 0)) / game.price) * 100)
    : 0
  const images = parseJsonArrayOrString(game.images)
  const genres = parseJsonArrayOrString(game.genres)

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-border/50 bg-card/80 backdrop-blur-sm">
      <Link href={`/games/${game.slug}`} aria-label={t("detailsAria", { title: game.title })}>
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
          {images.length > 0 ? (
            <>
              <Image
                src={images[0]}
                alt={t("coverAlt", { title: game.title })}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                loading="lazy"
              />
              {/* ✅ ОПТИМИЗИРОВАНО: Убраны shine effect и gradient overlay */}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50" aria-hidden="true">
              <span className="text-sm">{t("noImage")}</span>
            </div>
          )}
          {hasDiscount && discountPercent > 0 && (
            <Badge
              className="absolute top-3 right-3 shadow-lg z-10 border-2 border-background/50"
              variant="destructive"
              aria-label={t("discountAria", { percent: discountPercent })}
            >
              {t("discount", { percent: discountPercent })}
            </Badge>
          )}
        </div>
      </Link>
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors duration-300">
          {game.title}
        </CardTitle>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label={t("genresAria")}>
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
                  {formatPrice(finalPrice)}
                </span>
                <span className="text-sm line-through text-muted-foreground">
                  {formatPrice(game.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(finalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 relative z-10">
        <Link href={`/games/${game.slug}`} className="w-full" aria-label={t("detailsAriaButton", { title: game.title })}>
          <Button
            className="w-full shadow-md hover:shadow-lg transition-all duration-300"
            aria-label={t("detailsAriaButton", { title: game.title })}
          >
            {t("details")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
