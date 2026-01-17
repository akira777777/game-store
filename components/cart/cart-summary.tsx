"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CartSummaryProps {
  subtotal: number
  total: number
  itemCount: number
  discount?: number
}

export function CartSummary({ subtotal, total, itemCount, discount = 0 }: CartSummaryProps) {
  const formattedSubtotal = subtotal.toFixed(2)
  const formattedDiscount = discount.toFixed(2)
  const formattedTotal = total.toFixed(2)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Итого
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Товаров:</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Подытог:</span>
            <span>${formattedSubtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Скидка:</span>
              <Badge variant="destructive">-${formattedDiscount}</Badge>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>Итого:</span>
          <span className="text-primary">${formattedTotal}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link href="/checkout" className="w-full">
          <Button className="w-full" size="lg">
            Оформить заказ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/games" className="w-full">
          <Button variant="outline" className="w-full">
            Продолжить покупки
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
