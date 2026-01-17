import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const [gamesCount, ordersCount, totalRevenue] = await Promise.all([
    db.game.count(),
    db.order.count({
      where: { status: "PAID" },
    }),
    db.order.aggregate({
      where: { status: "PAID" },
      _sum: { total: true },
    }),
  ])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Панель управления</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Всего игр</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{gamesCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Оплаченных заказов</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{ordersCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Общая выручка</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${Number(totalRevenue._sum.total || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
