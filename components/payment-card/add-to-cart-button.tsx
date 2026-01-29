"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  cardId: string
  className?: string
}

export function AddToCartButton({ cardId, className }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    alert("Корзина временно недоступна. Функция добавления в корзину будет доступна в полной версии сайта.")
  }

  return (
    <Button
      className={cn("w-full", className)}
      size="lg"
      onClick={handleAddToCart}
    >
      Добавить в корзину
    </Button>
  )
}
