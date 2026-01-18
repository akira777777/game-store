import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  try {
    const session = await auth()

    if (!session?.user) {
      redirect("/login")
    }

    const [user, orders] = await Promise.all([
      db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
      db.order.findMany({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              game: {
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
        take: 10,
      }),
    ])

    if (!user) {
      redirect("/login")
    }

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
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Профиль"
          description="Управление вашим аккаунтом и просмотр истории заказов"
          backUrl="/"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Информация о пользователе</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Имя</p>
                  <p className="text-lg font-medium">{user.name || "Не указано"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Роль</p>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role === "ADMIN" ? "Администратор" : "Покупатель"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Дата регистрации</p>
                  <p className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>История заказов</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">У вас пока нет заказов</p>
                    <Link href="/games">
                      <Button>Перейти в каталог</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              Заказ #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">
                              ${Number(order.total).toFixed(2)}
                            </p>
                            <Badge variant={statusColors[order.status] as "default" | "secondary" | "destructive"}>
                              {statusLabels[order.status] || order.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2">Товары:</p>
                          <ul className="space-y-1">
                            {order.items.map((item) => {
                              const gameTitle = item.game?.title || "Товар удален"
                              const gameSlug = item.game?.slug || "#"
                              return (
                                <li key={item.id} className="text-sm text-muted-foreground">
                                  <Link
                                    href={gameSlug !== "#" ? `/games/${gameSlug}` : "#"}
                                    className="hover:text-primary hover:underline"
                                  >
                                    {gameTitle}
                                  </Link>
                                  {" × "}
                                  {item.quantity} - ${Number(item.price).toFixed(2)}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    throw error
  }
}
