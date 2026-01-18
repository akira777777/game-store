import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      items: {
        include: {
          game: {
            select: {
              title: true,
              slug: true,
            },
          },
          product: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const statusColors: Record<string, string> = {
    PENDING: "secondary",
    PAID: "default",
    PROCESSING: "default",
    COMPLETED: "default",
    CANCELLED: "destructive",
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Ожидает оплаты",
    PAID: "Оплачен",
    PROCESSING: "В обработке",
    COMPLETED: "Завершен",
    CANCELLED: "Отменен",
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Управление заказами</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Заказов пока нет</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Заказ #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.user.name || order.user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ${Number(order.total).toFixed(2)}
                    </p>
                    <Badge variant={statusColors[order.status] as any}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Дата: {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                  <div className="border-t pt-2">
                    <p className="text-sm font-medium mb-2">Товары:</p>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-sm text-muted-foreground">
                          {item.game?.title || item.product?.title || "Товар удален"} × {item.quantity} - $
                          {Number(item.price).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
