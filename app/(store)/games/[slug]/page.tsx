import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddToCartButton } from "@/components/game/add-to-cart-button"
import { parseJsonArrayOrString } from "@/lib/game-utils"

export const dynamic = "force-dynamic"

export default async function GamePage({
  params,
}: {
  params: { slug: string }
}) {
  const game = await db.game.findUnique({
    where: { slug: params.slug },
  })

  if (!game) {
    notFound()
  }

  const finalPrice = game.discountPrice || game.price
  const hasDiscount = !!game.discountPrice
  const images = parseJsonArrayOrString(game.images)
  const genres = parseJsonArrayOrString(game.genres)
  const platforms = parseJsonArrayOrString(game.platforms)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {images.length > 0 ? (
            <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
              <Image
                src={images[0]}
                alt={game.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Нет изображения</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
              {platforms.map((platform) => (
                <Badge key={platform}>{platform}</Badge>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Цена</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {hasDiscount ? (
                  <div>
                    <span className="text-4xl font-bold text-destructive">
                      ${finalPrice.toString()}
                    </span>
                    <span className="ml-3 text-xl line-through text-muted-foreground">
                      ${game.price.toString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold">
                    ${finalPrice.toString()}
                  </span>
                )}
              </div>
              {game.inStock ? (
                <AddToCartButton gameId={game.id} />
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Нет в наличии
                </Button>
              )}
            </CardContent>
          </Card>

          {game.developer && (
            <div>
              <p className="text-sm text-muted-foreground">Разработчик</p>
              <p className="font-medium">{game.developer}</p>
            </div>
          )}

          {game.publisher && (
            <div>
              <p className="text-sm text-muted-foreground">Издатель</p>
              <p className="font-medium">{game.publisher}</p>
            </div>
          )}

          {game.releaseDate && (
            <div>
              <p className="text-sm text-muted-foreground">Дата выхода</p>
              <p className="font-medium">
                {new Date(game.releaseDate).toLocaleDateString("ru-RU")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Описание</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{game.description}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link href="/games">
          <Button variant="outline">← Вернуться к каталогу</Button>
        </Link>
      </div>
    </div>
  )
}
