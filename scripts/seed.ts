// Seed script for adding test data
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'CUSTOMER',
    },
  })
  console.log('Created test user:', user.email)

  // Create sample games
  const games = [
    {
      title: 'Cyberpunk 2077',
      slug: 'cyberpunk-2077',
      description: 'Открытый мир в киберпанк-вселенной. Играйте за наемника в футуристическом мегаполисе Night City.',
      price: 59.99,
      discountPrice: 39.99,
      images: JSON.stringify(['https://images.igdb.com/igdb/image/upload/t_cover_big/co2xas.jpg']),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX']),
      genres: JSON.stringify(['ACTION', 'RPG']),
      featured: true,
      inStock: true,
      stockQuantity: 100,
      developer: 'CD Projekt RED',
      publisher: 'CD Projekt',
    },
    {
      title: 'The Witcher 3: Wild Hunt',
      slug: 'the-witcher-3',
      description: 'Эпическое приключение Геральта из Ривии в открытом мире фэнтези.',
      price: 39.99,
      discountPrice: null,
      images: JSON.stringify(['https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg']),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH']),
      genres: JSON.stringify(['RPG', 'ADVENTURE']),
      featured: true,
      inStock: true,
      stockQuantity: 50,
      developer: 'CD Projekt RED',
      publisher: 'CD Projekt',
    },
    {
      title: 'Elden Ring',
      slug: 'elden-ring',
      description: 'Темное фэнтези от создателей Dark Souls с открытым миром.',
      price: 59.99,
      discountPrice: 49.99,
      images: JSON.stringify(['https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg']),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX']),
      genres: JSON.stringify(['ACTION', 'RPG']),
      featured: false,
      inStock: true,
      stockQuantity: 75,
      developer: 'FromSoftware',
      publisher: 'Bandai Namco',
    },
    {
      title: 'Minecraft',
      slug: 'minecraft',
      description: 'Креативная игра про строительство и выживание в пиксельном мире.',
      price: 26.95,
      discountPrice: null,
      images: JSON.stringify(['https://images.igdb.com/igdb/image/upload/t_cover_big/co49x6.jpg']),
      platforms: JSON.stringify(['PC', 'MOBILE']),
      genres: JSON.stringify(['ADVENTURE', 'SIMULATION']),
      featured: false,
      inStock: true,
      stockQuantity: 999,
      developer: 'Mojang Studios',
      publisher: 'Mojang Studios',
    },
    {
      title: 'Grand Theft Auto V',
      slug: 'gta-v',
      description: 'Открытый мир криминального приключения в Лос-Сантосе.',
      price: 29.99,
      discountPrice: 19.99,
      images: JSON.stringify(['https://images.igdb.com/igdb/image/upload/t_cover_big/co49x7.jpg']),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX']),
      genres: JSON.stringify(['ACTION', 'ADVENTURE']),
      featured: true,
      inStock: true,
      stockQuantity: 200,
      developer: 'Rockstar Games',
      publisher: 'Rockstar Games',
    },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: game,
      create: game,
    })
    console.log(`Created/updated game: ${game.title}`)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
