"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Check, Gift, Mail, Sparkles, Star } from "lucide-react"
import { useState } from "react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubscribed(true)
    setLoading(false)
    setEmail("")
    setTimeout(() => setSubscribed(false), 3000)
  }

  const benefits = [
    { icon: Gift, text: "Эксклюзивные скидки до 80%", color: "text-purple-500" },
    { icon: Star, text: "Ранний доступ к новинкам", color: "text-yellow-500" },
    { icon: Bell, text: "Уведомления о предзаказах", color: "text-blue-500" },
    { icon: Sparkles, text: "Персональные рекомендации", color: "text-pink-500" },
  ]

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/20 blur-3xl animate-pulse" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-primary/20 blur-xl animate-float" style={{ width: `${Math.random() * 100 + 50}px`, height: `${Math.random() * 100 + 50}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i}s` }} />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-primary/20 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 text-center space-y-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 shadow-lg animate-float">
                <Mail className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Будьте в{" "}
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    курсе событий
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Подпишитесь на рассылку и получайте эксклюзивные предложения
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                      <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="max-w-md mx-auto">
                {!subscribed ? (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input type="email" placeholder="Ваш email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 h-12" disabled={loading} />
                      <Button type="submit" size="lg" className="gap-2 h-12 group" disabled={loading}>
                        {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mail className="h-4 w-4" />}
                        Подписаться
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-4 animate-scale-in">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border-2 border-green-500">
                      <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-lg font-semibold">Спасибо за подписку!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
