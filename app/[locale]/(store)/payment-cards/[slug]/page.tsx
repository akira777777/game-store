import { AddToCartButton } from "@/components/payment-card/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import { mockPaymentCards } from "@/lib/mock-data"
import { CreditCard, Globe, DollarSign } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PaymentCardDetailPage({ params }: Props) {
  const { slug } = await params
  
  // Find card in mock data
  const card = mockPaymentCards.find(c => c.slug === slug)

  if (!card) {
    notFound()
  }

  const images = JSON.parse(card.images)
  const finalPrice = card.discountPrice || card.price
  const discount = card.discountPrice
    ? Math.round(((card.price - card.discountPrice) / card.price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Image */}
        <div>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            {images[0] ? (
              <Image
                src={images[0]}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CreditCard className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{card.title}</h1>
            {card.description && (
              <p className="text-muted-foreground">{card.description}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            {card.discountPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    -{discount}%
                  </Badge>
                  <span className="text-2xl font-bold">${finalPrice.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground line-through">
                    ${card.price.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-2xl font-bold">${card.price.toFixed(2)}</span>
            )}
          </div>

          {/* Card Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">Тип:</span>
              <Badge variant="secondary">{card.cardType}</Badge>
            </div>

            {card.region && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Регион:</span>
                <Badge variant="outline">{card.region}</Badge>
              </div>
            )}

            {card.denomination && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">Номинал:</span>
                <span>${card.denomination}</span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {card.inStock ? (
              <Badge variant="default" className="bg-green-600">
                В наличии
              </Badge>
            ) : (
              <Badge variant="destructive">
                Нет в наличии
              </Badge>
            )}
          </div>

          {/* Add to Cart */}
          {card.inStock && <AddToCartButton cardId={card.id} />}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Информация</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Цифровая доставка</p>
          <p>• Мгновенная активация</p>
          <p>• Гарантия подлинности</p>
          <p>• Поддержка 24/7</p>
        </div>
      </div>
    </div>
  )
}
