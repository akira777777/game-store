
import { db } from '../lib/db'

async function test() {
  const genre = 'ACTION'
  console.log(`Searching for genre: ${genre}`)

  const games = await db.game.findMany({
    where: {
      genreItems: {
        some: {
          name: { equals: genre }
        }
      }
    },
    include: {
      genreItems: true
    }
  })

  console.log(`Found ${games.length} games.`)
  games.forEach(g => {
    console.log(`- ${g.title} [${g.genreItems.map(gx => gx.name).join(', ')}]`)
  })
}

test()
  .catch(console.error)
  .finally(() => db.$disconnect())
