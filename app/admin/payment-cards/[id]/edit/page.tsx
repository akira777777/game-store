"use client"

import { PageHeader } from "@/components/layout/page-header"
import { useToast } from "@/components/providers/toast-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingButton } from "@/components/ui/loading-button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditPaymentCardPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { handleError, showSuccess } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    cardType: "",
    region: "",
    currency: "USD",
    denomination: "",
    price: "",
    discountPrice: "",
    images: "[]",
    featured: false,
    inStock: true,
    stockQuantity: "0",
  })

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/admin/payment-cards/${params.id}`)
        if (!response.ok) {
          throw new Error("Card not found")
        }
        const data = await response.json()
        const card = data.card

        setFormData({
          title: card.title,
          slug: card.slug,
          description: card.description || "",
          cardType: card.cardType,
          region: card.region || "",
          currency: card.currency || "USD",
          denomination: card.denomination?.toString() || "",
          price: card.price.toString(),
          discountPrice: card.discountPrice?.toString() || "",
          images: typeof card.images === "string" ? card.images : JSON.stringify(card.images || []),
          featured: card.featured || false,
          inStock: card.inStock !== undefined ? card.inStock : true,
          stockQuantity: card.stockQuantity?.toString() || "0",
        })
      } catch (error) {
        handleError(error, "Fetch Card")
        router.push("/admin/payment-cards")
      } finally {
        setIsFetching(false)
      }
    }

    fetchCard()
  }, [params.id, router, handleError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/payment-cards/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
          denomination: formData.denomination ? parseFloat(formData.denomination) : null,
          stockQuantity: parseInt(formData.stockQuantity) || 0,
          images: formData.images ? JSON.parse(formData.images) : [],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Ошибка при обновлении карты")
      }

      showSuccess("Платежная карта успешно обновлена!")
      router.push("/admin/payment-cards")
    } catch (error) {
      handleError(error, "Update Payment Card")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <main className="container mx-auto px-4 py-8">
        <PageHeader title="Редактировать карту" backUrl="/admin/payment-cards" />
        <div className="text-center py-12">
          <p>Загрузка...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <PageHeader
        title="Редактировать платежную карту"
        backUrl="/admin/payment-cards"
      />

      <Card>
        <CardHeader>
          <CardTitle>Информация о карте</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  pattern="[a-z0-9-]+"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardType">Тип карты *</Label>
                <Input
                  id="cardType"
                  value={formData.cardType}
                  onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Регион</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Валюта</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="denomination">Номинал</Label>
                <Input
                  id="denomination"
                  type="number"
                  step="0.01"
                  value={formData.denomination}
                  onChange={(e) => setFormData({ ...formData, denomination: e.target.value })}
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
                <Label htmlFor="stockQuantity">Количество на складе</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Изображения (JSON массив)</Label>
                <Input
                  id="images"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder='["https://example.com/image.jpg"]'
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Популярная
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                />
                В наличии
              </label>
            </div>

            <div className="flex gap-4">
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Сохранение..."
              >
                Сохранить изменения
              </LoadingButton>
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
    </main>
  )
}
