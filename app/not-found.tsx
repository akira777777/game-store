import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Страница не найдена",
  description: "Запрашиваемая страница не существует",
}

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Search className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">404 - Страница не найдена</CardTitle>
          <CardDescription>
            Запрашиваемая страница не существует или была перемещена.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full" variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Вернуться на главную
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/games">
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              Перейти в каталог
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
