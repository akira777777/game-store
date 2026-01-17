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
