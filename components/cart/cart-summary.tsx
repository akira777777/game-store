"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface CartSummaryProps {
  subtotal: number
  total: number
  itemCount: number
  discount?: number
}

export function CartSummary({ subtotal, total, itemCount, discount = 0 }: CartSummaryProps) {
  const formattedSubtotal = formatCurrency(subtotal)
  const formattedDiscount = formatCurrency(discount)
  const formattedTotal = formatCurrency(total)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
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
            <span>{formattedSubtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Скидка:</span>
              <Badge variant="destructive">-{formattedDiscount}</Badge>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>Итого:</span>
          <span className="text-primary">{formattedTotal}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button asChild className="w-full" size="lg">
          <Link href="/checkout" aria-label="Перейти к оформлению заказа">
            Оформить заказ
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/games" aria-label="Вернуться к каталогу игр">
            Продолжить покупки
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}