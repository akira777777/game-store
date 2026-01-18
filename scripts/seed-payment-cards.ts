/**
 * Seed script for payment cards
 * Usage: npx tsx scripts/seed-payment-cards.ts
 */

import 'dotenv/config'
import { db } from '../lib/db'

const paymentCards = [
  {
    title: "Steam Wallet Card $50",
    slug: "steam-wallet-50-usd",
    description: "Пополните свой Steam кошелек на $50. Карта активируется мгновенно после покупки.",
    cardType: "Steam",
    region: "US",
    currency: "USD",
    denomination: 50,
    price: 52.99,
    discountPrice: 49.99,
    images: JSON.stringify(["https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg"]),
    featured: true,
    inStock: true,
    stockQuantity: 100,
  },
  {
    title: "PlayStation Store Card $20",
    slug: "playstation-store-20-usd",
    description: "Цифровая карта PlayStation Store на $20. Подходит для покупки игр, дополнений и подписок.",
    cardType: "PlayStation",
    region: "US",
    currency: "USD",
    denomination: 20,
    price: 21.99,
    discountPrice: null,
    images: JSON.stringify(["https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg"]),
    featured: false,
    inStock: true,
    stockQuantity: 50,
  },
  {
    title: "Xbox Gift Card $25",
    slug: "xbox-gift-card-25-usd",
    description: "Подарочная карта Xbox на $25. Используйте для покупки игр, подписок Xbox Game Pass и контента.",
    cardType: "Xbox",
    region: "US",
    currency: "USD",
    denomination: 25,
    price: 26.99,
    discountPrice: 24.99,
    images: JSON.stringify(["https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg"]),
    featured: true,
    inStock: true,
    stockQuantity: 75,
  },
  {
    title: "Nintendo eShop Card $35",
    slug: "nintendo-eshop-35-usd",
    description: "Карта Nintendo eShop на $35. Пополните баланс для покупки игр на Nintendo Switch.",
    cardType: "Nintendo",
    region: "US",
    currency: "USD",
    denomination: 35,
    price: 37.99,
    discountPrice: null,
    images: JSON.stringify(["https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg"]),
    featured: false,
    inStock: true,
    stockQuantity: 30,
  },
  {
    title: "PayPal Gift Card $100",
    slug: "paypal-gift-card-100-usd",
    description: "Подарочная карта PayPal на $100. Универсальная карта для любых покупок онлайн.",
    cardType: "PayPal",
    region: "Global",
    currency: "USD",
    denomination: 100,
    price: 105.99,
    discountPrice: 99.99,
    images: JSON.stringify(["https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg"]),
    featured: true,
    inStock: true,
    stockQuantity: 20,
  },
  {
    title: "Visa Prepaid Card $50",
    slug: "visa-prepaid-50-usd",
    description: "Предоплаченная карта Visa на $50. Используйте для покупок везде, где принимают Visa.",
    cardType: "Visa",
    region: "US",
    currency: "USD",
    denomination: 50,
    price: 54.99,
    discountPrice: null,
    images: JSON.stringify(["https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg"]),
    featured: false,
    inStock: true,
    stockQuantity: 40,
  },
  {
    title: "Mastercard Gift Card $75",
    slug: "mastercard-gift-75-usd",
    description: "Подарочная карта Mastercard на $75. Принимается миллионами магазинов по всему миру.",
    cardType: "Mastercard",
    region: "Global",
    currency: "USD",
    denomination: 75,
    price: 79.99,
    discountPrice: 74.99,
    images: JSON.stringify(["https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg"]),
    featured: true,
    inStock: true,
    stockQuantity: 25,
  },
  {
    title: "Epic Games Store Card $15",
    slug: "epic-games-store-15-usd",
    description: "Карта Epic Games Store на $15. Для покупки игр и контента в Epic Games Store.",
    cardType: "Epic Games",
    region: "US",
    currency: "USD",
    denomination: 15,
    price: 16.99,
    discountPrice: null,
    images: JSON.stringify(["https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg"]),
    featured: false,
    inStock: true,
    stockQuantity: 60,
  },
]

async function main() {
  console.log('🌱 Starting payment cards seeding...')

  for (const cardData of paymentCards) {
    const card = await db.paymentCard.upsert({
      where: { slug: cardData.slug },
      update: cardData,
      create: cardData,
    })
    console.log(`✅ Created/updated payment card: ${card.title}`)
  }

  console.log(`\n🎉 Seeding completed! ${paymentCards.length} payment cards processed.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
