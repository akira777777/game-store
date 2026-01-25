"use client"

import { ImageArrayInput } from "@/components/admin/image-array-input"
import { MultiSelectButtons } from "@/components/admin/multi-select-buttons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

const platforms: string[] = ["PC", "PLAYSTATION", "XBOX", "NINTENDO_SWITCH", "MOBILE"]
const genres: string[] = ["ACTION", "ADVENTURE", "RPG", "STRATEGY", "SPORTS", "RACING", "SHOOTER", "SIMULATION", "INDIE", "PUZZLE"]

export default function NewGamePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    images: [] as string[],
    releaseDate: "",
    developer: "",
    publisher: "",
    platforms: [] as string[],
    genres: [] as string[],
    featured: false,
    inStock: true,
    stockQuantity: "0",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
          images: JSON.stringify(formData.images.filter(img => img.trim() !== "")),
          platforms: JSON.stringify(formData.platforms),
          genres: JSON.stringify(formData.genres),
          stockQuantity: parseInt(formData.stockQuantity) || 0,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Ошибка создания игры")
        return
      }

      router.push("/admin/games")
      router.refresh()
    } catch (error) {
      console.error("Error creating game:", error)
      setError("Произошла ошибка при создании игры")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Создать игру</h1>

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

              <div className="space-y-2 md:col-span-2">
                <Label>Изображения</Label>
                <ImageArrayInput
                  values={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
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

            <MultiSelectButtons
              label="Платформы"
              options={platforms}
              selected={formData.platforms}
              onChange={(platforms) => setFormData({ ...formData, platforms })}
            />

            <MultiSelectButtons
              label="Жанры"
              options={genres}
              selected={formData.genres}
              onChange={(genres) => setFormData({ ...formData, genres })}
            />

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
                {isSubmitting ? "Создание..." : "Создать игру"}
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
