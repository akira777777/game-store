"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseJsonArrayOrString } from "@/lib/game-utils"

const platforms: string[] = ["PC", "PLAYSTATION", "XBOX", "NINTENDO_SWITCH", "MOBILE"]
const genres: string[] = ["ACTION", "ADVENTURE", "RPG", "STRATEGY", "SPORTS", "RACING", "SHOOTER", "SIMULATION", "INDIE", "PUZZLE"]

export default function EditGamePage() {
  const router = useRouter()
  const params = useParams()
  const gameId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    images: "",
    releaseDate: "",
    developer: "",
    publisher: "",
    platforms: [] as string[],
    genres: [] as string[],
    featured: false,
    inStock: true,
    stockQuantity: "0",
  })

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/admin/games/${gameId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch game")
        }
        const data = await response.json()
        const game = data.game
        
        setFormData({
          title: game.title,
          slug: game.slug,
          description: game.description,
          price: game.price.toString(),
          discountPrice: game.discountPrice?.toString() || "",
          images: parseJsonArrayOrString(game.images).join(", "),
          releaseDate: game.releaseDate ? new Date(game.releaseDate).toISOString().split("T")[0] : "",
          developer: game.developer || "",
          publisher: game.publisher || "",
          platforms: parseJsonArrayOrString(game.platforms),
          genres: parseJsonArrayOrString(game.genres),
          featured: game.featured,
          inStock: game.inStock,
          stockQuantity: game.stockQuantity.toString(),
        })
      } catch (error) {
        console.error("Error fetching game:", error)
        setError("Ошибка загрузки игры")
      } finally {
        setIsLoading(false)
      }
    }

    if (gameId) {
      fetchGame()
    }
  }, [gameId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
          images: formData.images ? JSON.stringify(formData.images.split(",").map((img) => img.trim())) : "[]",
          platforms: JSON.stringify(formData.platforms),
          genres: JSON.stringify(formData.genres),
          stockQuantity: parseInt(formData.stockQuantity) || 0,
          releaseDate: formData.releaseDate || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Ошибка обновления игры")
        return
      }

      router.push("/admin/games")
      router.refresh()
    } catch (error) {
      console.error("Error updating game:", error)
      setError("Произошла ошибка при обновлении игры")
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const toggleGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Редактировать игру</h1>

      <Card>
        <CardHeader>
          <CardTitle>Информация об игре</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Название *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="game-title"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Описание *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPrice">Цена со скидкой</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">URL изображений (через запятую)</Label>
                <Input
                  id="images"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate">Дата выхода</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="developer">Разработчик</Label>
                <Input
                  id="developer"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher">Издатель</Label>
                <Input
                  id="publisher"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Количество на складе</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Платформы</Label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform}
                    type="button"
                    variant={formData.platforms.includes(platform) ? "default" : "outline"}
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Жанры</Label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    type="button"
                    variant={formData.genres.includes(genre) ? "default" : "outline"}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="featured">Рекомендуемая игра</Label>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="inStock"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="inStock">В наличии</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
