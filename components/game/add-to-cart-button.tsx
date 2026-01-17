"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface AddToCartButtonProps {
  gameId: string
}

export function AddToCartButton({ gameId }: AddToCartButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login")
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, quantity: 1 }),
      })

      if (response.ok) {
        router.push("/cart")
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "Ошибка при добавлении в корзину")
      }
    } catch (error) {
      alert("Произошла ошибка")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      {isAdding ? "Добавление..." : "Добавить в корзину"}
    </Button>
  )
}
