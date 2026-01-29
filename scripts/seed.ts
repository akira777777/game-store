import { PrismaClient } from '@prisma/client'
import { mockGames, mockPaymentCards } from '../lib/mock-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Use try-catch for cleanup as tables might not exist or connection might fail
  try {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.game.deleteMany()
    await prisma.paymentCard.deleteMany()
    await prisma.user.deleteMany()
  } catch (e) {
    console.warn('Cleanup failed (expected if DB is empty or unreachable):', e)
  }

  try {
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
  } catch (e) {
    console.error('Seeding failed:', e)
    // Don't exit with error to avoid failing the build if seed is run during build (unlikely but safe)
    // process.exit(1)
  }
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
