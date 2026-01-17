import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div>
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="text-2xl font-bold">
              Админ-панель
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/games">
                <Button variant="ghost">Игры</Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="ghost">Заказы</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost">На сайт</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
