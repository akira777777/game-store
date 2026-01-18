import { Button } from "@/components/ui/button"
import { ArrowRight, Gamepad2, Headset, ShieldCheck, Sparkles, Star, Users, Zap } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/lib/navigation"

export async function HeroSection() {
  const t = await getTranslations("hero")
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-primary/3 to-background py-16 sm:py-24 lg:py-32">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse" aria-hidden="true" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse delay-1000" aria-hidden="true" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
        {/* Additional decorative elements */}
        <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl animate-pulse delay-500" aria-hidden="true" />
        <div className="absolute bottom-20 left-20 h-40 w-40 rounded-full bg-primary/8 blur-2xl animate-pulse delay-700" aria-hidden="true" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Enhanced Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-md px-5 py-2.5 text-sm shadow-lg animate-fade-in hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
            <span className="font-medium text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {t("badge")}
            </span>
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10 animate-pulse" aria-hidden="true" />
          </div>

          {/* Main heading */}
          <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl animate-fade-in">
            <span className="inline-block mb-2">{t("title")}</span>
            <br />
            <span className="inline-block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
              {t("titleHighlight")}
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed animate-fade-in">
            {t("description")}
            <br className="hidden sm:block" />
            <span className="text-foreground font-medium">{t("exclusiveDiscounts")}</span> {t("instantDelivery")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-16 animate-fade-in">
            <Button
              asChild
              size="lg"
              className="group text-base sm:text-lg px-8 sm:px-10 py-7 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              aria-label={t("goToCatalog")}
            >
              <Link href="/games">
                {t("goToCatalog")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-8 sm:px-10 py-7 w-full sm:w-auto border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105"
              aria-label={t("popularGames")}
            >
              <Link href="/games?featured=true">
                <Gamepad2 className="mr-2 h-5 w-5" aria-hidden="true" />
                {t("popularGames")}
              </Link>
            </Button>
          </div>

          {/* Enhanced Features grid */}
          <ul className="mt-12 grid gap-6 sm:grid-cols-3 text-left mb-16" aria-label="Преимущества магазина">
            <li className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-md p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Zap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold group-hover:text-primary transition-colors">{t("instantDeliveryTitle")}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("instantDeliveryDesc")}
                </p>
              </div>
            </li>
            <li className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-md p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold group-hover:text-primary transition-colors">{t("securePaymentTitle")}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("securePaymentDesc")}
                </p>
              </div>
            </li>
            <li className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-md p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Headset className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold group-hover:text-primary transition-colors">{t("support24Title")}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("support24Desc")}
                </p>
              </div>
            </li>
          </ul>

          {/* Enhanced Stats */}
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            <div className="group space-y-3 p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gamepad2 className="h-5 w-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </div>
              <dt className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
                1000+
              </dt>
              <dd className="text-sm sm:text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors">{t("gamesInCatalog")}</dd>
            </div>
            <div className="group space-y-3 p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </div>
              <dt className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
                50K+
              </dt>
              <dd className="text-sm sm:text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors">{t("happyCustomers")}</dd>
            </div>
            <div className="group space-y-3 p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </div>
              <dt className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
                24/7
              </dt>
              <dd className="text-sm sm:text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors">{t("support")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}