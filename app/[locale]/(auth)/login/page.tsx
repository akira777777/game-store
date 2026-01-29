// Placeholder page - auth functionality removed
"use client"

import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Авторизация временно недоступна</h1>
          <p className="text-muted-foreground">
            Функция входа будет доступна после подключения базы данных.
          </p>
        </div>
        <Button className="w-full" onClick={() => window.history.back()}>
          Вернуться назад
        </Button>
      </div>
    </div>
  )
}
