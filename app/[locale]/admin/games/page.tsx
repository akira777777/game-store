import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/db"
import { Link } from "@/lib/navigation"
import { Edit, Plus } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminGamesPage() {
  const games = await db.game.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Управление играми</h1>
        <Link href="/admin/games/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить игру
          </Button>
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Игр пока нет</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Вы еще не добавили ни одной игры. Создайте первую игру прямо сейчас.
            </p>
            <Link href="/admin/games/new">
              <Button>Добавить первую игру</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Метки</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">
                        ${Number(game.discountPrice || game.price).toFixed(2)}
                      </span>
                      {game.discountPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${Number(game.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {game.inStock ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200">
                        В наличии
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Нет в наличии
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {game.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/games/${game.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
