"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ru">
      <body>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Критическая ошибка</CardTitle>
              <CardDescription>
                Произошла критическая ошибка приложения. Пожалуйста, обновите страницу или вернитесь на главную.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2">
              <Button onClick={reset} className="w-full" variant="default">
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                Обновить страницу
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                  Вернуться на главную
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}
