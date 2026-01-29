import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { mockGames, mockPaymentCards } from '../lib/mock-data'

const connectionString = process.env.DATABASE_URL ?? "file:./prisma/dev.db"

console.log('Connection string:', connectionString)
const adapter = new PrismaBetterSqlite3({ url: connectionString })
console.log('Adapter created')
const prisma = new PrismaClient({ adapter })
console.log('Client created')

async function main() {
  console.log('Start seeding ...')

  // Cleanup
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.game.deleteMany()
  await prisma.paymentCard.deleteMany()
  await prisma.user.deleteMany()

  // Create User
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
      password: 'hashedpassword123', // In real app should be hashed
      role: 'CUSTOMER'
    }
  })
  console.log(`Created user with id: ${user.id}`)

  // Create Games
  for (const game of mockGames) {
    const { id, ...data } = game
    const createdGame = await prisma.game.create({
      data: {
        ...data,
        id: undefined // Let Prisma generate CUID
      }
    })
    console.log(`Created game: ${createdGame.title}`)
  }

  // Create Payment Cards
  for (const card of mockPaymentCards) {
    const { id, ...data } = card
    const createdCard = await prisma.paymentCard.create({
      data: {
        ...data,
        id: undefined // Let Prisma generate CUID
      }
    })
    console.log(`Created card: ${createdCard.title}`)
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
