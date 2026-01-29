import { AddToCartButton } from "@/components/game/add-to-cart-button"
import { GameCard } from "@/components/game/game-card"
import { ImageGallery } from "@/components/game/image-gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockGames } from "@/lib/mock-data"
import { Calendar, ShoppingCart, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function GameDetailPage({ params }: Props) {
  const { slug } = await params
  
  // Find game in mock data
  const game = mockGames.find(g => g.slug === slug)

  if (!game) {
    notFound()
  }

  const images = JSON.parse(game.images)
  const platforms = JSON.parse(game.platforms)
  const genres = JSON.parse(game.genres)
  const finalPrice = game.discountPrice || game.price
  const discount = game.discountPrice
    ? Math.round(((game.price - game.discountPrice) / game.price) * 100)
    : 0

  // Get related games (other games with same genre)
  const relatedGames = mockGames
    .filter(g => g.id !== game.id && g.inStock)
    .slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Images */}
        <div>
          <ImageGallery images={images} title={game.title} />
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            {game.developer && (
              <p className="text-muted-foreground">
                от {game.developer}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            {game.discountPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    -{discount}%
                  </Badge>
                  <span className="text-2xl font-bold">${finalPrice.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground line-through">
                    ${game.price.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-2xl font-bold">${game.price.toFixed(2)}</span>
            )}
          </div>

          {/* Platforms */}
          <div>
            <h3 className="font-semibold mb-2">Платформы:</h3>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform: string) => (
                <Badge key={platform} variant="secondary">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <h3 className="font-semibold mb-2">Жанры:</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre: string) => (
                <Badge key={genre} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Release Date */}
          {game.releaseDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Дата выхода: {new Date(game.releaseDate).toLocaleDateString()}
            </div>
          )}

          {/* Stock Status */}
          <div>
            {game.inStock ? (
              <Badge variant="default" className="bg-green-600">
                В наличии
              </Badge>
            ) : (
              <Badge variant="destructive">
                Нет в наличии
              </Badge>
            )}
          </div>

          {/* Add to Cart */}
          {game.inStock && <AddToCartButton gameId={game.id} />}
        </div>
      </div>

      {/* Description */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Описание</h2>
        <p className="text-muted-foreground leading-relaxed">{game.description}</p>
      </div>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Похожие игры</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedGames.map((relatedGame) => (
              <GameCard key={relatedGame.id} game={relatedGame} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
