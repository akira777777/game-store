import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminGamesPage() {
  const games = await db.game.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Управление играми</h1>
        <Link href="/admin/games/new">
          <Button>Добавить игру</Button>
        </Link>
      </div>

      {games.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Игр пока нет</p>
            <Link href="/admin/games/new">
              <Button>Добавить первую игру</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id}>
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  {game.featured && (
                    <Badge variant="default">Рекомендуемая</Badge>
                  )}
                  {game.inStock ? (
                    <Badge variant="secondary">В наличии</Badge>
                  ) : (
                    <Badge variant="destructive">Нет в наличии</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    ${Number(game.discountPrice || game.price).toFixed(2)}
                  </span>
                  <Link href={`/admin/games/${game.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Редактировать
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
