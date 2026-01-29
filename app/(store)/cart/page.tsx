"use client"

import { PageHeader } from "@/components/layout/page-header"
import { useToast } from "@/components/providers/toast-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import { normalizeJsonArray } from "@/lib/game-utils"
import { formatCurrency } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface CartItem {
  id: string
  quantity: number
  gameId?: string | null
  paymentCardId?: string | null
  game?: {
    id: string
    title: string
    slug: string
    price: number
    discountPrice: number | null
    images: string[] | string
    inStock: boolean
  } | null
  paymentCard?: {
    id: string
    title: string
    slug: string
    price: number
    discountPrice: number | null
    images: string[] | string
    inStock: boolean
  } | null
}

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { handleError, showSuccess } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }
    fetchCart()
  }, [session, router])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      const data = await response.json()
      setItems(data.items || [])
    } catch {
      // Error handled silently - UI will show empty cart
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (item: CartItem, quantity: number) => {
    try {
      const body = item.gameId
        ? { gameId: item.gameId, quantity }
        : item.paymentCardId
          ? { paymentCardId: item.paymentCardId, quantity }
          : null

      if (!body) return

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchCart()
      }
    } catch {
      // Error handled silently - cart state will not update
    }
  }

  const removeItem = async (item: CartItem) => {
    try {
      const url = item.gameId
        ? `/api/cart?gameId=${item.gameId}`
        : item.paymentCardId
          ? `/api/cart?paymentCardId=${item.paymentCardId}`
          : null

      if (!url) return

      const response = await fetch(url, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCart()
      }
    } catch {
      // Error handled silently - item will not be removed
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Ошибка при оформлении заказа")
      }

      const data = await response.json()

      if (data.url) {
        showSuccess("Перенаправление на страницу оплаты...")
        window.location.href = data.url
      } else {
        throw new Error("Не получен URL для оплаты")
      }
    } catch (error) {
      handleError(error, "Checkout")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Загрузка...</p>
      </div>
    )
  }

  const total = items.reduce((sum, item) => {
    const product = item.game || item.paymentCard
    if (!product) return sum
    const basePrice = Number.isFinite(Number(product.price)) ? Number(product.price) : 0
    const discountValue = product.discountPrice !== null && Number.isFinite(Number(product.discountPrice))
      ? Number(product.discountPrice)
      : null
    const finalPrice = discountValue && discountValue > 0 ? discountValue : basePrice
    return sum + finalPrice * item.quantity
  }, 0)

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6" role="main">
      <PageHeader
        title="Корзина"
        description="Товары, которые вы добавили в корзину"
        backUrl="/games"
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 rounded-xl border bg-muted/40">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
            🛒
          </div>
          <p className="text-muted-foreground mb-4 text-lg">
            Ваша корзина пуста
          </p>
          <Link href="/games">
            <Button size="lg" className="shadow-sm">
              Перейти в каталог
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.game || item.paymentCard
              if (!product) return null

              const basePrice = Number.isFinite(Number(product.price)) ? Number(product.price) : 0
              const discountValue = product.discountPrice !== null && Number.isFinite(Number(product.discountPrice))
                ? Number(product.discountPrice)
                : null
              const finalPrice = discountValue && discountValue > 0 ? discountValue : basePrice
              const hasDiscount = discountValue !== null && discountValue > 0 && basePrice > finalPrice
              const images = normalizeJsonArray(product.images)
              const productSlug = product.slug || "#"
              const productUrl = item.gameId
                ? `/games/${productSlug}`
                : item.paymentCardId
                  ? `/payment-cards/${productSlug}`
                  : "#"

              return (
                <Card key={item.id} className="shadow-sm border-border/60">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <Link href={productUrl} aria-label={`Перейти к товару ${product.title}`}>
                        <div className="relative w-full sm:w-28 h-40 sm:h-28 bg-muted rounded-lg overflow-hidden ring-1 ring-border/60">
                          {images.length > 0 ? (
                            <Image
                              src={images[0]}
                              alt={`Обложка товара ${product.title}`}
                              fill
                              className="object-cover"
                              sizes="96px"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground" role="img" aria-label="Изображение недоступно">
                              Нет изображения
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 space-y-3">
                        <Link href={productUrl} aria-label={`Подробнее о товаре ${product.title}`}>
                          <h3 className="font-semibold text-lg sm:text-xl hover:underline leading-tight">
                            {product.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4">
                          {hasDiscount ? (
                            <div>
                              <span className="text-lg font-bold text-destructive">
                                {formatCurrency(finalPrice)}
                              </span>
                              <span className="ml-2 text-sm line-through text-muted-foreground">
                                {formatCurrency(basePrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold">
                              {formatCurrency(finalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2">
                            <label htmlFor={`quantity-${item.id}`} className="text-sm">Количество:</label>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              min="1"
                              max="99"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1
                                updateQuantity(item, newQuantity)
                              }}
                              className="w-20"
                              aria-label={`Количество товара ${product.title}`}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              removeItem(item)
                            }}
                            aria-label={`Удалить ${product.title} из корзины`}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(finalPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="xl:sticky xl:top-24">
            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle>Итого</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Товаров ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Всего</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <LoadingButton
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  isLoading={isCheckingOut}
                  loadingText="Обработка..."
                >
                  Оформить заказ
                </LoadingButton>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  )
}
