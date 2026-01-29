
import { db } from '../lib/db'

async function verify() {
  const genres = await db.genre.findMany({ include: { games: true } })
  const platforms = await db.platform.findMany({ include: { games: true } })

  console.log(`Genres found: ${genres.length}`)
  genres.forEach(g => {
    console.log(`- ${g.name} (${g.games.length} games)`)
  })

  console.log(`Platforms found: ${platforms.length}`)
  platforms.forEach(p => {
    console.log(`- ${p.name} (${p.games.length} games)`)
  })
}

verify()
  .catch(console.error)
  .finally(() => db.$disconnect())
