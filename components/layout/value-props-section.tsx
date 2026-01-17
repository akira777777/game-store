import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones, ShieldCheck, Sparkles, Zap } from "lucide-react"

const valueProps = [
  {
    title: "Мгновенная доставка",
    description: "Получайте цифровые ключи сразу после оплаты без ожидания.",
    icon: Zap,
  },
  {
    title: "Безопасные платежи",
    description: "Покупайте с уверенностью благодаря защищенным транзакциям.",
    icon: ShieldCheck,
  },
  {
    title: "Поддержка 24/7",
    description: "Ответим на вопросы в любое время и поможем с покупкой.",
    icon: Headphones,
  },
  {
    title: "Новые релизы",
    description: "Добавляем горячие новинки и проверенные хиты каждый день.",
    icon: Sparkles,
  },
]

export function ValuePropsSection() {
  return (
    <section
      className="rounded-2xl border bg-muted/30 p-6 sm:p-10"
      aria-labelledby="value-props-heading"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit">
            Преимущества
          </Badge>
          <h2 id="value-props-heading" className="text-2xl sm:text-3xl font-bold text-balance">
            Почему выбирают Game Store
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Мы собрали лучший каталог игр с удобным поиском, безопасной оплатой и
            мгновенной доставкой цифровых копий.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {valueProps.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.title} className="h-full">
                <Card className="h-full border-none bg-background shadow-elevation-1">
                  <CardHeader className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
