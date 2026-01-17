/**
 * Seed script for populating database with diverse game data
 * 
 * This script creates:
 * - Admin and test users
 * - 30+ diverse games across multiple genres and platforms
 * - Real IGDB image URLs for visual appeal
 * 
 * To use IGDB API integration, set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET
 * in your .env file (see .env.example)
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { fetchGameBySlug, convertIGDBGameToDbFormat, isIGDBConfigured } from '../lib/igdb'
import { toDbJsonArray } from '../lib/game-utils'

const prisma = new PrismaClient()

interface GameSeedData {
  title: string
  slug: string
  description: string
  price: number
  discountPrice: number | null
  images: string[]
  platforms: string[]
  genres: string[]
  featured: boolean
  inStock: boolean
  stockQuantity: number
  developer: string | null
  publisher: string | null
  releaseDate?: Date | null
}

/**
 * Static game data with real IGDB image IDs
 * Falls back to this data if IGDB API is unavailable or game not found
 */
const staticGames: GameSeedData[] = [
  // AAA Action/RPG Games
  {
    title: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    description: 'Открытый мир в киберпанк-вселенной. Играйте за наемника в футуристическом мегаполисе Night City.',
    price: 59.99,
    discountPrice: 39.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co2xas.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['ACTION', 'RPG'],
    featured: true,
    inStock: true,
    stockQuantity: 100,
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    releaseDate: new Date('2020-12-10'),
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    slug: 'the-witcher-3',
    description: 'Эпическое приключение Геральта из Ривии в открытом мире фэнтези. Один из лучших RPG всех времен.',
    price: 39.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH'],
    genres: ['RPG', 'ADVENTURE'],
    featured: true,
    inStock: true,
    stockQuantity: 50,
    developer: 'CD Projekt RED',
    publisher: 'CD Projekt',
    releaseDate: new Date('2015-05-19'),
  },
  {
    title: 'Elden Ring',
    slug: 'elden-ring',
    description: 'Темное фэнтези от создателей Dark Souls с открытым миром и захватывающим боевым геймплеем.',
    price: 59.99,
    discountPrice: 49.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['ACTION', 'RPG'],
    featured: true,
    inStock: true,
    stockQuantity: 75,
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    releaseDate: new Date('2022-02-25'),
  },
  {
    title: 'God of War',
    slug: 'god-of-war',
    description: 'Эмоциональное путешествие Кратоса и его сына Атрея по скандинавской мифологии.',
    price: 49.99,
    discountPrice: 29.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg'],
    platforms: ['PLAYSTATION', 'PC'],
    genres: ['ACTION', 'ADVENTURE'],
    featured: true,
    inStock: true,
    stockQuantity: 60,
    developer: 'Santa Monica Studio',
    publisher: 'Sony Interactive Entertainment',
    releaseDate: new Date('2018-04-20'),
  },
  {
    title: 'Red Dead Redemption 2',
    slug: 'red-dead-redemption-2',
    description: 'Эпическая история преступника Артура Моргана на Диком Западе в 1899 году.',
    price: 59.99,
    discountPrice: 39.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1trf.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['ACTION', 'ADVENTURE'],
    featured: true,
    inStock: true,
    stockQuantity: 80,
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    releaseDate: new Date('2018-10-26'),
  },
  {
    title: 'Grand Theft Auto V',
    slug: 'gta-v',
    description: 'Открытый мир криминального приключения в Лос-Сантосе. Три главных героя, одна история.',
    price: 29.99,
    discountPrice: 19.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co49x7.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['ACTION', 'ADVENTURE'],
    featured: true,
    inStock: true,
    stockQuantity: 200,
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    releaseDate: new Date('2013-09-17'),
  },
  {
    title: 'Baldur\'s Gate 3',
    slug: 'baldurs-gate-3',
    description: 'Эпическая RPG на основе Dungeons & Dragons. Ваши решения формируют историю.',
    price: 59.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co6bx2.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['RPG', 'ADVENTURE'],
    featured: true,
    inStock: true,
    stockQuantity: 68,
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    releaseDate: new Date('2023-08-03'),
  },

  // Indie Games
  {
    title: 'Hades',
    slug: 'hades',
    description: 'Рогалик о сыне Аида, пытающемся сбежать из подземного мира. Превосходный боевой геймплей.',
    price: 24.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co2r7f.jpg'],
    platforms: ['PC', 'NINTENDO_SWITCH', 'PLAYSTATION', 'XBOX'],
    genres: ['ACTION', 'INDIE', 'RPG'],
    featured: false,
    inStock: true,
    stockQuantity: 150,
    developer: 'Supergiant Games',
    publisher: 'Supergiant Games',
    releaseDate: new Date('2020-09-17'),
  },
  {
    title: 'Hollow Knight',
    slug: 'hollow-knight',
    description: 'Метроидвания о маленьком рыцаре, исследующем заброшенное королевство насекомых.',
    price: 14.99,
    discountPrice: 9.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1wmu.jpg'],
    platforms: ['PC', 'NINTENDO_SWITCH', 'PLAYSTATION', 'XBOX'],
    genres: ['ADVENTURE', 'INDIE', 'ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 120,
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    releaseDate: new Date('2017-02-24'),
  },
  {
    title: 'Celeste',
    slug: 'celeste',
    description: 'Платформер о девушке Мадлин, покоряющей гору Селеста. Трогательная история и сложный геймплей.',
    price: 19.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1m88.jpg'],
    platforms: ['PC', 'NINTENDO_SWITCH', 'PLAYSTATION', 'XBOX'],
    genres: ['INDIE', 'PUZZLE', 'ADVENTURE'],
    featured: false,
    inStock: true,
    stockQuantity: 100,
    developer: 'Maddy Makes Games',
    publisher: 'Maddy Makes Games',
    releaseDate: new Date('2018-01-25'),
  },
  {
    title: 'Stardew Valley',
    slug: 'stardew-valley',
    description: 'Симулятор фермы, где вы выращиваете урожай, разводите животных и общаетесь с жителями города.',
    price: 14.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1rld.jpg'],
    platforms: ['PC', 'NINTENDO_SWITCH', 'MOBILE', 'PLAYSTATION', 'XBOX'],
    genres: ['SIMULATION', 'INDIE', 'RPG'],
    featured: false,
    inStock: true,
    stockQuantity: 180,
    developer: 'ConcernedApe',
    publisher: 'ConcernedApe',
    releaseDate: new Date('2016-02-26'),
  },
  {
    title: 'Dead Cells',
    slug: 'dead-cells',
    description: 'Рогалик-метроидвания с плавным боевым геймплеем и процедурно генерируемыми уровнями.',
    price: 24.99,
    discountPrice: 19.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8p.jpg'],
    platforms: ['PC', 'NINTENDO_SWITCH', 'PLAYSTATION', 'XBOX', 'MOBILE'],
    genres: ['ACTION', 'INDIE', 'RPG'],
    featured: false,
    inStock: true,
    stockQuantity: 130,
    developer: 'Motion Twin',
    publisher: 'Motion Twin',
    releaseDate: new Date('2018-08-07'),
  },
  {
    title: 'Valheim',
    slug: 'valheim',
    description: 'Выживание и исследование в мифологическом мире викингов. Стройте замки и выживайте.',
    price: 19.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co2lx2.jpg'],
    platforms: ['PC'],
    genres: ['ADVENTURE', 'SIMULATION', 'INDIE'],
    featured: false,
    inStock: true,
    stockQuantity: 120,
    developer: 'Iron Gate AB',
    publisher: 'Coffee Stain Publishing',
    releaseDate: new Date('2021-02-02'),
  },

  // Strategy Games
  {
    title: 'Civilization VI',
    slug: 'civilization-vi',
    description: 'Постройте величайшую империю от древности до современности. Один ход может изменить историю.',
    price: 59.99,
    discountPrice: 39.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg'],
    platforms: ['PC', 'NINTENDO_SWITCH', 'MOBILE'],
    genres: ['STRATEGY', 'SIMULATION'],
    featured: false,
    inStock: true,
    stockQuantity: 90,
    developer: 'Firaxis Games',
    publisher: '2K Games',
    releaseDate: new Date('2016-10-21'),
  },
  {
    title: 'Total War: Warhammer III',
    slug: 'total-war-warhammer-3',
    description: 'Тактическая стратегия в мире Warhammer. Массовые сражения и глобальная карта.',
    price: 59.99,
    discountPrice: 49.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co2k7c.jpg'],
    platforms: ['PC'],
    genres: ['STRATEGY', 'ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 70,
    developer: 'Creative Assembly',
    publisher: 'SEGA',
    releaseDate: new Date('2022-02-17'),
  },
  {
    title: 'XCOM 2',
    slug: 'xcom-2',
    description: 'Тактическая стратегия о сопротивлении инопланетному вторжению. Каждое решение имеет значение.',
    price: 49.99,
    discountPrice: 19.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1rhy.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH'],
    genres: ['STRATEGY'],
    featured: false,
    inStock: true,
    stockQuantity: 85,
    developer: 'Firaxis Games',
    publisher: '2K Games',
    releaseDate: new Date('2016-02-05'),
  },

  // Shooter Games
  {
    title: 'DOOM Eternal',
    slug: 'doom-eternal',
    description: 'Интенсивный шутер от первого лица. Уничтожайте демонов ада в адреналиновом боевом геймплее.',
    price: 39.99,
    discountPrice: 29.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1rqp.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH'],
    genres: ['SHOOTER', 'ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 110,
    developer: 'id Software',
    publisher: 'Bethesda Softworks',
    releaseDate: new Date('2020-03-20'),
  },
  {
    title: 'Counter-Strike 2',
    slug: 'counter-strike-2',
    description: 'Легендарный тактический шутер. Командный геймплей на основе Source 2.',
    price: 0,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co6wmr.jpg'],
    platforms: ['PC'],
    genres: ['SHOOTER', 'ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 999,
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: new Date('2023-09-27'),
  },
  {
    title: 'Apex Legends',
    slug: 'apex-legends',
    description: 'Бесплатная королевская битва с уникальными героями и быстрым темпом игры.',
    price: 0,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1x6k.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'MOBILE'],
    genres: ['SHOOTER', 'ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 999,
    developer: 'Respawn Entertainment',
    publisher: 'Electronic Arts',
    releaseDate: new Date('2019-02-04'),
  },

  // Racing Games
  {
    title: 'Forza Horizon 5',
    slug: 'forza-horizon-5',
    description: 'Открытый мир гонок в Мексике. Сотни машин и невероятная графика.',
    price: 59.99,
    discountPrice: 49.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co3vuz.jpg'],
    platforms: ['PC', 'XBOX'],
    genres: ['RACING', 'SIMULATION'],
    featured: false,
    inStock: true,
    stockQuantity: 95,
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    releaseDate: new Date('2021-11-05'),
  },
  {
    title: 'Mario Kart 8 Deluxe',
    slug: 'mario-kart-8-deluxe',
    description: 'Классические гонки Марио с друзьями. Веселье и хаос на трассе.',
    price: 59.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg'],
    platforms: ['NINTENDO_SWITCH'],
    genres: ['RACING', 'ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 140,
    developer: 'Nintendo',
    publisher: 'Nintendo',
    releaseDate: new Date('2017-04-28'),
  },

  // Adventure/Puzzle Games
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    slug: 'zelda-breath-of-the-wild',
    description: 'Открытый мир Хайрула. Исследуйте, решайте головоломки и спасите принцессу Зельду.',
    price: 59.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg'],
    platforms: ['NINTENDO_SWITCH'],
    genres: ['ADVENTURE', 'ACTION', 'PUZZLE'],
    featured: true,
    inStock: true,
    stockQuantity: 105,
    developer: 'Nintendo',
    publisher: 'Nintendo',
    releaseDate: new Date('2017-03-03'),
  },
  {
    title: 'Portal 2',
    slug: 'portal-2',
    description: 'Физическая головоломка с портальной пушкой. Остроумный юмор и захватывающий геймплей.',
    price: 9.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8u.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['PUZZLE', 'ADVENTURE'],
    featured: false,
    inStock: true,
    stockQuantity: 200,
    developer: 'Valve',
    publisher: 'Valve',
    releaseDate: new Date('2011-04-19'),
  },
  {
    title: 'It Takes Two',
    slug: 'it-takes-two',
    description: 'Кооперативное приключение о паре, превращенной в куклы. Только для двух игроков.',
    price: 39.99,
    discountPrice: 29.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co2lws.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH'],
    genres: ['ADVENTURE', 'PUZZLE', 'ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 65,
    developer: 'Hazelight Studios',
    publisher: 'Electronic Arts',
    releaseDate: new Date('2021-03-26'),
  },

  // Sports Games
  {
    title: 'FIFA 24',
    slug: 'fifa-24',
    description: 'Самый реалистичный футбольный симулятор. Играйте за любимые команды и создавайте свою карьеру.',
    price: 69.99,
    discountPrice: 49.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co6p3h.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH'],
    genres: ['SPORTS', 'SIMULATION'],
    featured: false,
    inStock: true,
    stockQuantity: 160,
    developer: 'EA Sports',
    publisher: 'Electronic Arts',
    releaseDate: new Date('2023-09-29'),
  },
  {
    title: 'Rocket League',
    slug: 'rocket-league',
    description: 'Футбол на автомобилях. Быстрый, захватывающий и аддиктивный.',
    price: 0,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0a.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH'],
    genres: ['SPORTS', 'RACING', 'ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 999,
    developer: 'Psyonix',
    publisher: 'Psyonix',
    releaseDate: new Date('2015-07-07'),
  },

  // Simulation Games
  {
    title: 'Minecraft',
    slug: 'minecraft',
    description: 'Креативная игра про строительство и выживание в пиксельном мире. Безграничные возможности.',
    price: 26.95,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co49x6.jpg'],
    platforms: ['PC', 'MOBILE', 'NINTENDO_SWITCH', 'PLAYSTATION', 'XBOX'],
    genres: ['ADVENTURE', 'SIMULATION', 'INDIE'],
    featured: true,
    inStock: true,
    stockQuantity: 999,
    developer: 'Mojang Studios',
    publisher: 'Mojang Studios',
    releaseDate: new Date('2011-11-18'),
  },
  {
    title: 'The Sims 4',
    slug: 'the-sims-4',
    description: 'Симулятор жизни. Создавайте симов, стройте дома и управляйте их жизнью.',
    price: 39.99,
    discountPrice: 19.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8j.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['SIMULATION'],
    featured: false,
    inStock: true,
    stockQuantity: 125,
    developer: 'Maxis',
    publisher: 'Electronic Arts',
    releaseDate: new Date('2014-09-02'),
  },
  {
    title: 'Cities: Skylines',
    slug: 'cities-skylines',
    description: 'Градостроительный симулятор. Создавайте и управляйте своим мегаполисом.',
    price: 29.99,
    discountPrice: 14.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8l.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH'],
    genres: ['SIMULATION', 'STRATEGY'],
    featured: false,
    inStock: true,
    stockQuantity: 88,
    developer: 'Colossal Order',
    publisher: 'Paradox Interactive',
    releaseDate: new Date('2015-03-10'),
  },

  // Horror Games
  {
    title: 'Resident Evil 4',
    slug: 'resident-evil-4',
    description: 'Переосмысление классического хоррора. Леон Кеннеди против зомби и культистов.',
    price: 59.99,
    discountPrice: 49.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co5x7v.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['ACTION', 'ADVENTURE'],
    featured: false,
    inStock: true,
    stockQuantity: 72,
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: new Date('2023-03-24'),
  },
  {
    title: 'Phasmophobia',
    slug: 'phasmophobia',
    description: 'Многопользовательский хоррор о охотниках за привидениями. Работайте в команде или умирайте вместе.',
    price: 13.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co2k3x.jpg'],
    platforms: ['PC'],
    genres: ['INDIE', 'ADVENTURE'],
    featured: false,
    inStock: true,
    stockQuantity: 190,
    developer: 'Kinetic Games',
    publisher: 'Kinetic Games',
    releaseDate: new Date('2020-09-18'),
  },

  // Fighting Games
  {
    title: 'Street Fighter 6',
    slug: 'street-fighter-6',
    description: 'Легендарная серия файтингов возвращается. Новые бойцы и улучшенный геймплей.',
    price: 59.99,
    discountPrice: 49.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co5x7v.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX'],
    genres: ['ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 82,
    developer: 'Capcom',
    publisher: 'Capcom',
    releaseDate: new Date('2023-06-02'),
  },
  {
    title: 'Mortal Kombat 11',
    slug: 'mortal-kombat-11',
    description: 'Кровавый файтинг с жестокими фаталити. Классика жанра в современной обертке.',
    price: 49.99,
    discountPrice: 29.99,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8r.jpg'],
    platforms: ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH'],
    genres: ['ACTION'],
    featured: false,
    inStock: true,
    stockQuantity: 76,
    developer: 'NetherRealm Studios',
    publisher: 'Warner Bros. Interactive',
    releaseDate: new Date('2019-04-23'),
  },

  // Additional Popular Games
  {
    title: 'Animal Crossing: New Horizons',
    slug: 'animal-crossing-new-horizons',
    description: 'Расслабляющий симулятор жизни на необитаемом острове. Создавайте свой рай.',
    price: 59.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8k.jpg'],
    platforms: ['NINTENDO_SWITCH'],
    genres: ['SIMULATION', 'ADVENTURE'],
    featured: false,
    inStock: true,
    stockQuantity: 155,
    developer: 'Nintendo',
    publisher: 'Nintendo',
    releaseDate: new Date('2020-03-20'),
  },
  {
    title: 'Among Us',
    slug: 'among-us',
    description: 'Мультиплеерная игра на социальную дедукцию для 4-15 игроков. Работайте вместе, но остерегайтесь самозванца!',
    price: 4.99,
    discountPrice: null,
    images: ['https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg'],
    platforms: ['PC', 'MOBILE'],
    genres: ['PUZZLE', 'INDIE'],
    featured: false,
    inStock: true,
    stockQuantity: 500,
    developer: 'InnerSloth',
    publisher: 'InnerSloth',
    releaseDate: new Date('2018-06-15'),
  },
]

async function main() {
  console.log('🌱 Starting database seeding...')

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
  console.log('✅ Created admin user:', admin.email)

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
<<<<<<< Current (Your changes)
  console.log('Created test user:', user.email)

  // Create sample games with real image URLs from IGDB and free sources
  const games = [
    // AAA Games
    {
      title: 'Cyberpunk 2077',
      slug: 'cyberpunk-2077',
      description: 'Открытый мир в киберпанк-вселенной. Играйте за наемника в футуристическом мегаполисе Night City. Сюжетная RPG с глубокой кастомизацией персонажа и множеством вариантов прохождения.',
      price: 59.99,
      discountPrice: 39.99,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.png',
        'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc6.jpg'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX']),
      genres: JSON.stringify(['ACTION', 'RPG']),
      featured: true,
      inStock: true,
      stockQuantity: 100,
      developer: 'CD Projekt RED',
      publisher: 'CD Projekt',
      releaseDate: new Date('2020-12-10'),
    },
    {
      title: 'The Witcher 3: Wild Hunt',
      slug: 'the-witcher-3',
      description: 'Эпическое приключение Геральта из Ривии в открытом мире фэнтези. Одна из лучших RPG всех времен с богатым сюжетом, запоминающимися персонажами и огромным миром для исследования.',
      price: 39.99,
      discountPrice: null,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
        'https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc1.jpg'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH']),
      genres: JSON.stringify(['RPG', 'ADVENTURE']),
      featured: true,
      inStock: true,
      stockQuantity: 50,
      developer: 'CD Projekt RED',
      publisher: 'CD Projekt',
      releaseDate: new Date('2015-05-19'),
    },
    {
      title: 'Elden Ring',
      slug: 'elden-ring',
      description: 'Темное фэнтези от создателей Dark Souls с открытым миром. Исследуйте огромный мир, сражайтесь с могущественными врагами и раскрывайте тайны Земных Колец.',
      price: 59.99,
      discountPrice: 49.99,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX']),
      genres: JSON.stringify(['ACTION', 'RPG']),
      featured: false,
      inStock: true,
      stockQuantity: 75,
      developer: 'FromSoftware',
      publisher: 'Bandai Namco Entertainment',
      releaseDate: new Date('2022-02-25'),
    },
    {
      title: 'Grand Theft Auto V',
      slug: 'gta-v',
      description: 'Открытый мир криминального приключения в Лос-Сантосе. Три протагониста, масштабный мир, насыщенный сюжет и невероятная свобода действий.',
      price: 29.99,
      discountPrice: 19.99,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co49x7.jpg',
        'https://images.pexels.com/photos/2425011/pexels-photo-2425011.jpeg?auto=compress&cs=tinysrgb&w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX']),
      genres: JSON.stringify(['ACTION', 'ADVENTURE']),
      featured: true,
      inStock: true,
      stockQuantity: 200,
      developer: 'Rockstar Games',
      publisher: 'Rockstar Games',
      releaseDate: new Date('2013-09-17'),
    },
    {
      title: 'Minecraft',
      slug: 'minecraft',
      description: 'Креативная игра про строительство и выживание в пиксельном мире. Стройте, исследуйте, выживайте и творите в бесконечном мире, ограниченном только вашей фантазией.',
      price: 26.95,
      discountPrice: null,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co49x6.jpg',
        'https://images.unsplash.com/photo-1606503153255-59d8b8b59678?w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'MOBILE']),
      genres: JSON.stringify(['ADVENTURE', 'SIMULATION']),
      featured: false,
      inStock: true,
      stockQuantity: 999,
      developer: 'Mojang Studios',
      publisher: 'Mojang Studios',
      releaseDate: new Date('2011-11-18'),
    },
    // Indie Games
    {
      title: 'Hades',
      slug: 'hades',
      description: 'Roguelike экшен-RPG, где вы играете за Загрея, сына Аида, пытающегося выбраться из подземного мира. Каждая смерть - это новый шанс, каждая встреча - часть истории.',
      price: 24.99,
      discountPrice: 12.49,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co2r7f.jpg',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH']),
      genres: JSON.stringify(['ACTION', 'RPG', 'INDIE']),
      featured: true,
      inStock: true,
      stockQuantity: 150,
      developer: 'Supergiant Games',
      publisher: 'Supergiant Games',
      releaseDate: new Date('2020-09-17'),
    },
    {
      title: 'Hollow Knight',
      slug: 'hollow-knight',
      description: 'Классический Metroidvania с прекрасным ручным анимационным стилем. Исследуйте обширный взаимосвязанный мир, полный чудовищ, друзей и древних тайн.',
      price: 14.99,
      discountPrice: null,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co1xca.jpg',
        'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH']),
      genres: JSON.stringify(['ADVENTURE', 'INDIE']),
      featured: false,
      inStock: true,
      stockQuantity: 80,
      developer: 'Team Cherry',
      publisher: 'Team Cherry',
      releaseDate: new Date('2017-02-24'),
    },
    {
      title: 'Celeste',
      slug: 'celeste',
      description: 'Точный платформер о восхождении на гору Селеста. Мадлен должна столкнуться со своими внутренними демонами в путешествии, которое заставит вас бросить вызов своим навыкам.',
      price: 19.99,
      discountPrice: 4.99,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH']),
      genres: JSON.stringify(['PUZZLE', 'INDIE']),
      featured: false,
      inStock: true,
      stockQuantity: 60,
      developer: 'Extremely OK Games',
      publisher: 'Matt Makes Games',
      releaseDate: new Date('2018-01-25'),
    },
    {
      title: 'Stardew Valley',
      slug: 'stardew-valley',
      description: 'Успокаивающая фермерская симуляция с элементами RPG. Унаследуйте старую ферму, выращивайте урожай, разводите животных и станьте частью местного сообщества.',
      price: 14.99,
      discountPrice: null,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co3fcf.jpg',
        'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH', 'MOBILE']),
      genres: JSON.stringify(['SIMULATION', 'INDIE']),
      featured: true,
      inStock: true,
      stockQuantity: 300,
      developer: 'ConcernedApe',
      publisher: 'ConcernedApe',
      releaseDate: new Date('2016-02-26'),
    },
    {
      title: 'Valheim',
      slug: 'valheim',
      description: 'Выживание и исследование в мифологическом мире викингов. Стройте мощные замки, сражайтесь с легендарными существами и выживайте в процедурно генерируемом мире.',
      price: 19.99,
      discountPrice: null,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lx2.jpg',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1280'
      ]),
      platforms: JSON.stringify(['PC']),
      genres: JSON.stringify(['ADVENTURE', 'SIMULATION', 'INDIE']),
      featured: false,
      inStock: true,
      stockQuantity: 120,
      developer: 'Iron Gate AB',
      publisher: 'Coffee Stain Publishing',
      releaseDate: new Date('2021-02-02'),
    },
    // Strategy & Other Genres
    {
      title: 'Civilization VI',
      slug: 'civilization-vi',
      description: 'Легендарная пошаговая стратегия, где вы строите империю, которая выдержит испытание временем. Исследуйте, расширяйте, эксплуатируйте и уничтожайте.',
      price: 59.99,
      discountPrice: 19.99,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg',
        'https://images.pexels.com/photos/1480366/pexels-photo-1480366.jpeg?auto=compress&cs=tinysrgb&w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'NINTENDO_SWITCH']),
      genres: JSON.stringify(['STRATEGY']),
      featured: false,
      inStock: true,
      stockQuantity: 90,
      developer: 'Firaxis Games',
      publisher: '2K Games',
      releaseDate: new Date('2016-10-21'),
    },
    {
      title: 'FIFA 24',
      slug: 'fifa-24',
      description: 'Официальный футбольный симулятор с реалистичной графикой, физикой и множеством игровых режимов. Создайте свою команду мечты и покорите мир футбола.',
      price: 69.99,
      discountPrice: 49.99,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x9p.jpg',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX']),
      genres: JSON.stringify(['SPORTS', 'SIMULATION']),
      featured: true,
      inStock: true,
      stockQuantity: 250,
      developer: 'EA Sports',
      publisher: 'Electronic Arts',
      releaseDate: new Date('2023-09-29'),
    },
    {
      title: 'Rocket League',
      slug: 'rocket-league',
      description: 'Футбол на ракетных машинах! Высокооктановая смесь гоночной аркадной игры и футбола создает уникальный игровой опыт.',
      price: 19.99,
      discountPrice: null,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r0a.jpg',
        'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH']),
      genres: JSON.stringify(['SPORTS', 'RACING']),
      featured: false,
      inStock: true,
      stockQuantity: 180,
      developer: 'Psyonix',
      publisher: 'Psyonix',
      releaseDate: new Date('2015-07-07'),
    },
    {
      title: 'Among Us',
      slug: 'among-us',
      description: 'Мультиплеерная игра на социальную дедукцию для 4-15 игроков. Работайте вместе, чтобы завершить задачи, но остерегайтесь самозванца!',
      price: 4.99,
      discountPrice: null,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co2dkv.jpg',
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1280'
      ]),
      platforms: JSON.stringify(['PC', 'MOBILE']),
      genres: JSON.stringify(['PUZZLE', 'INDIE']),
      featured: false,
      inStock: true,
      stockQuantity: 500,
      developer: 'InnerSloth',
      publisher: 'InnerSloth',
      releaseDate: new Date('2018-06-15'),
    },
    {
      title: 'Counter-Strike 2',
      slug: 'counter-strike-2',
      description: 'Лучший в мире соревновательный FPS. CS2 представляет Source 2 и новые карты, улучшенную графику и обновленный геймплей знаменитой серии.',
      price: 0,
      discountPrice: null,
      images: JSON.stringify([
        'https://images.igdb.com/igdb/image/upload/t_cover_big/co6x5w.jpg',
        'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1280'
      ]),
      platforms: JSON.stringify(['PC']),
      genres: JSON.stringify(['SHOOTER']),
      featured: true,
      inStock: true,
      stockQuantity: 9999,
      developer: 'Valve',
      publisher: 'Valve',
      releaseDate: new Date('2023-09-27'),
    },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: game,
      create: game,
    })
    console.log(`Created/updated game: ${game.title}`)
=======
  console.log('✅ Created test user:', user.email)

  // Determine if we should try IGDB API
  const useIGDB = isIGDBConfigured()
  if (useIGDB) {
    console.log('🔗 IGDB API configured, attempting to fetch real game data...')
  } else {
    console.log('⚠️  IGDB API not configured, using static game data')
    console.log('   (Set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in .env to enable API integration)')
  }

  // Process games
  console.log(`\n📦 Processing ${staticGames.length} games...`)
  
  for (const staticGame of staticGames) {
    try {
      let gameData: GameSeedData = staticGame

      // Try to fetch from IGDB if configured
      if (useIGDB) {
        try {
          const igdbGame = await fetchGameBySlug(staticGame.slug)
          if (igdbGame) {
            const converted = convertIGDBGameToDbFormat(igdbGame, staticGame.price)
            // Merge with static data (prefer static for metadata we control)
            gameData = {
              ...converted,
              // Keep our pricing and stock info
              price: staticGame.price,
              discountPrice: staticGame.discountPrice,
              featured: staticGame.featured,
              inStock: staticGame.inStock,
              stockQuantity: staticGame.stockQuantity,
              // Merge images (IGDB + static)
              images: converted.images.length > 0 
                ? [...new Set([...converted.images, ...staticGame.images])]
                : staticGame.images,
              // Use IGDB data if available, otherwise static
              developer: converted.developer || staticGame.developer,
              publisher: converted.publisher || staticGame.publisher,
              releaseDate: converted.releaseDate || staticGame.releaseDate,
            }
            console.log(`  ✓ Fetched from IGDB: ${gameData.title}`)
          }
        } catch (error) {
          console.log(`  ⚠️  IGDB fetch failed for ${staticGame.slug}, using static data`)
        }
      }

      // Save to database
      await prisma.game.upsert({
        where: { slug: gameData.slug },
        update: {
          title: gameData.title,
          description: gameData.description,
          price: gameData.price,
          discountPrice: gameData.discountPrice,
          images: toDbJsonArray(gameData.images),
          platforms: toDbJsonArray(gameData.platforms),
          genres: toDbJsonArray(gameData.genres),
          featured: gameData.featured,
          inStock: gameData.inStock,
          stockQuantity: gameData.stockQuantity,
          developer: gameData.developer,
          publisher: gameData.publisher,
          releaseDate: gameData.releaseDate || null,
        },
        create: {
          title: gameData.title,
          slug: gameData.slug,
          description: gameData.description,
          price: gameData.price,
          discountPrice: gameData.discountPrice,
          images: toDbJsonArray(gameData.images),
          platforms: toDbJsonArray(gameData.platforms),
          genres: toDbJsonArray(gameData.genres),
          featured: gameData.featured,
          inStock: gameData.inStock,
          stockQuantity: gameData.stockQuantity,
          developer: gameData.developer,
          publisher: gameData.publisher,
          releaseDate: gameData.releaseDate || null,
        },
      })
      console.log(`  ✅ Created/updated: ${gameData.title}`)
      
      // Small delay to avoid rate limits
      if (useIGDB) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${staticGame.title}:`, error)
    }
>>>>>>> Incoming (Background Agent changes)
  }

  console.log(`\n🎉 Seeding completed! ${staticGames.length} games processed.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
