"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface CartItem {
  id: string
  quantity: number
  game: {
    id: string
    title: string
    slug: string
    price: number
    discountPrice: number | null
    images: string[]
  }
}

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
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
    } catch (error) {
      // Error handled silently - UI will show empty cart
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (gameId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, quantity }),
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      // Error handled silently - cart state will not update
    }
  }

  const removeItem = async (gameId: string) => {
    try {
      const response = await fetch(`/api/cart?gameId=${gameId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      // Error handled silently - item will not be removed
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      // Error handled silently - checkout will not proceed
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
    const price = Number(item.game.discountPrice || item.game.price)
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Корзина</h1>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Ваша корзина пуста
            </p>
            <Link href="/games">
              <Button>Перейти в каталог</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = Number(item.game.discountPrice || item.game.price)
              const hasDiscount = !!item.game.discountPrice

              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Link href={`/games/${item.game.slug}`}>
                        <div className="relative w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          {(() => {
                            const images = typeof item.game.images === 'string' 
                              ? JSON.parse(item.game.images || '[]') 
                              : (Array.isArray(item.game.images) ? item.game.images : [])
                            return images.length > 0 ? (
                              <Image
                                src={images[0]}
                                alt={item.game.title}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                Нет изображения
                              </div>
                            )
                          })()}
                        </div>
                      </Link>

                      <div className="flex-1">
                        <Link href={`/games/${item.game.slug}`}>
                          <h3 className="font-semibold text-lg mb-2 hover:underline">
                            {item.game.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                          {hasDiscount ? (
                            <div>
                              <span className="text-lg font-bold text-destructive">
                                ${price.toFixed(2)}
                              </span>
                              <span className="ml-2 text-sm line-through text-muted-foreground">
                                ${Number(item.game.price).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold">
                              ${price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <label className="text-sm">Количество:</label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1
                                updateQuantity(item.game.id, newQuantity)
                              }}
                              className="w-20"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.game.id)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold">
                          ${(price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Итого</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Товаров ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Всего</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Обработка..." : "Оформить заказ"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
