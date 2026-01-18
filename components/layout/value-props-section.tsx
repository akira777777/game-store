import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { getTranslations } from "next-intl/server"

export async function ValuePropsSection() {
  const t = await getTranslations("valueProps")

  const valueProps = [
    {
      title: t("instantDelivery.title"),
      description: t("instantDelivery.description"),
      icon: Zap,
    },
    {
      title: t("securePayments.title"),
      description: t("securePayments.description"),
      icon: ShieldCheck,
    },
    {
      title: t("support24.title"),
      description: t("support24.description"),
      icon: Headphones,
    },
    {
      title: t("newReleases.title"),
      description: t("newReleases.description"),
      icon: Sparkles,
    },
  ]

  return (
    <section
      className="rounded-2xl border bg-muted/30 p-6 sm:p-10"
      aria-labelledby="value-props-heading"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit">
            {t("badge")}
          </Badge>
          <h2 id="value-props-heading" className="text-2xl sm:text-3xl font-bold text-balance">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            {t("description")}
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
