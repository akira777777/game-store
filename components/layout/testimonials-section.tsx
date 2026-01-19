"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"
import { useEffect, useState } from "react"

const testimonials = [
  {
    id: 1,
    name: "Алексей Морозов",
    role: "Pro Gamer",
    avatar: "/avatars/user1.jpg",
    rating: 5,
    text: "Лучший магазин игр! Мгновенная доставка ключей, отличные цены и всегда актуальные новинки. Покупаю здесь уже больше года!",
    game: "Cyberpunk 2077"
  },
  {
    id: 2,
    name: "Мария Соколова",
    role: "Стример",
    avatar: "/avatars/user2.jpg",
    rating: 5,
    text: "Невероятный сервис! Техподдержка отвечает моментально, а каталог игр просто огромный. Рекомендую всем своим подписчикам!",
    game: "Baldur's Gate 3"
  },
  {
    id: 3,
    name: "Дмитрий Волков",
    role: "Casual Player",
    avatar: "/avatars/user3.jpg",
    rating: 5,
    text: "Приятные скидки и акции каждую неделю. Купил несколько AAA-игр со скидкой до 70%. Очень доволен!",
    game: "Starfield"
  },
  {
    id: 4,
    name: "Екатерина Петрова",
    role: "Коллекционер игр",
    avatar: "/avatars/user4.jpg",
    rating: 5,
    text: "Огромный выбор! От инди-игр до блокбастеров. Интерфейс удобный, поиск работает отлично. 10/10!",
    game: "Hollow Knight"
  },
  {
    id: 5,
    name: "Иван Кузнецов",
    role: "Game Developer",
    avatar: "/avatars/user5.jpg",
    rating: 5,
    text: "Как разработчик игр, ценю качественные площадки. Game Store - один из лучших. Быстро, надёжно, безопасно!",
    game: "Unity Assets"
  },
  {
    id: 6,
    name: "Анна Смирнова",
    role: "Esports Player",
    avatar: "/avatars/user6.jpg",
    rating: 5,
    text: "Покупаю все игры для тренировок здесь. Никаких проблем, всё работает как часы. Лучший выбор для геймеров!",
    game: "CS:GO Prime"
  }
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden border-y bg-gradient-to-br from-background via-primary/[0.02] to-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" aria-hidden="true" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-4">
            <Quote className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Отзывы игроков</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Что говорят{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              наши клиенты
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Более 50,000 довольных геймеров со всего мира выбирают наш магазин
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="group relative p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-md overflow-hidden"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              
              {/* Decorative quote mark */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-16 w-16 text-primary" aria-hidden="true" />
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{testimonial.role}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4" aria-label={`Рейтинг: ${testimonial.rating} из 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      } transition-transform group-hover:scale-110`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-sm text-foreground/90 leading-relaxed mb-4 line-clamp-4 group-hover:text-foreground transition-colors">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                {/* Game Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-xs font-medium text-primary border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                  {testimonial.game}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-border/50">
          {[
            { value: "50K+", label: "Довольных клиентов", icon: "👥" },
            { value: "4.9/5", label: "Средний рейтинг", icon: "⭐" },
            { value: "99.8%", label: "Успешных доставок", icon: "✅" },
            { value: "24/7", label: "Поддержка", icon: "💬" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-background/90 to-background/70 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
