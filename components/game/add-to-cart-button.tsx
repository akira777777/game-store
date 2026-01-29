"use client"

import { Button } from "@/components/ui/button"

interface AddToCartButtonProps {
  gameId: string
}

export function AddToCartButton({ gameId }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    alert("Корзина временно недоступна. Функция добавления в корзину будет доступна в полной версии сайта.")
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleAddToCart}
    >
      Добавить в корзину
    </Button>
  )
}
