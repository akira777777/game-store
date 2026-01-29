
import { db } from '../lib/db'

async function benchmark() {
  console.log('🚀 Starting benchmark...')

  const iterations = 100
  const genresToTest = ['ACTION', 'RPG', 'INDIE', 'STRATEGY', 'SHOOTER']
  const platformsToTest = ['PC', 'PLAYSTATION', 'XBOX', 'NINTENDO_SWITCH']

  let totalTime = 0

  for (let i = 0; i < iterations; i++) {
    const genre = genresToTest[Math.floor(Math.random() * genresToTest.length)]
    const platform = platformsToTest[Math.floor(Math.random() * platformsToTest.length)]

    const start = performance.now()

    // Mimic the logic in app/api/games/route.ts
    await db.game.findMany({
      where: {
        inStock: true,
        genreItems: {
          some: {
            OR: [
              // SQLite does not support Prisma's mode: 'insensitive'
              // Using exact match here to match the casing from the genre list
              { name: { equals: genre } },
              { slug: { equals: genre.toLowerCase() } }
            ]
          }
        },
        platformItems: {
          some: {
            OR: [
              { name: { equals: platform } },
              { slug: { equals: platform.toLowerCase() } }
            ]
          }
        }
      },
      take: 12,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const end = performance.now()
    totalTime += (end - start)
  }

  const avgTime = totalTime / iterations
  console.log(`📊 Average query time over ${iterations} iterations: ${avgTime.toFixed(4)} ms`)

  // Also count total games to ensure we have data
  const count = await db.game.count()
  console.log(`ℹ️ Total games in DB: ${count}`)
}

benchmark()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
