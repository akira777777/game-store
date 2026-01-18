import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Gamepad2, Puzzle, Sparkles, Sword, Target, Zap } from "lucide-react"
import { Link } from "@/lib/navigation"
import { getTranslations } from "next-intl/server"

const categories = [
  {
    name: "Action",
    slug: "ACTION",
    icon: Zap,
    color: "from-red-500/20 to-orange-500/20",
    hoverColor: "hover:from-red-500/30 hover:to-orange-500/30",
  },
  {
    name: "RPG",
    slug: "RPG",
    icon: Sword,
    color: "from-purple-500/20 to-pink-500/20",
    hoverColor: "hover:from-purple-500/30 hover:to-pink-500/30",
  },
  {
    name: "Shooter",
    slug: "SHOOTER",
    icon: Target,
    color: "from-blue-500/20 to-cyan-500/20",
    hoverColor: "hover:from-blue-500/30 hover:to-cyan-500/30",
  },
  {
    name: "Racing",
    slug: "RACING",
    icon: Car,
    color: "from-yellow-500/20 to-amber-500/20",
    hoverColor: "hover:from-yellow-500/30 hover:to-amber-500/30",
  },
  {
    name: "Puzzle",
    slug: "PUZZLE",
    icon: Puzzle,
    color: "from-green-500/20 to-emerald-500/20",
    hoverColor: "hover:from-green-500/30 hover:to-emerald-500/30",
  },
  {
    name: "Indie",
    slug: "INDIE",
    icon: Sparkles,
    color: "from-indigo-500/20 to-violet-500/20",
    hoverColor: "hover:from-indigo-500/30 hover:to-violet-500/30",
  },
]

export async function CategoriesSection() {
  const t = await getTranslations("categories")

  return (
    <section className="space-y-8" aria-labelledby="categories-heading">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-md">
            <Gamepad2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="gap-2 w-full sm:w-auto">
          <Link href="/games">
            {t("allCategories")}
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <Link
              key={category.slug}
              href={`/games?genre=${category.slug}`}
              className="group"
              aria-label={t("ariaLabel", { name: t(`items.${category.name}.name`) })}
            >
              <Card
                className={`relative overflow-hidden border border-border/50 bg-gradient-to-br ${category.color} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 ${category.hoverColor}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm text-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {t(`items.${category.name}.name`)}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {t(`items.${category.name}.description`)}
                    </p>
                  </div>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
