import { db } from '@/lib/db'
import { writeFileSync } from 'fs'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // #region agent log
  try { writeFileSync('c:\\Users\\-\\Desktop\\game-store\\.cursor\\debug.log', JSON.stringify({ location: 'app/sitemap.ts:8', message: 'Sitemap generation start', data: { nodeEnv: process.env.NODE_ENV, isBuild: process.env.NEXT_PHASE === 'phase-production-build' }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'B' }) + '\n', { flag: 'a' }) } catch (e) { }
  // #endregion

  let games: { slug: string; updatedAt: Date }[] = []
  // Get all games for dynamic routes
  try {
    // #region agent log
    try { writeFileSync('c:\\Users\\-\\Desktop\\game-store\\.cursor\\debug.log', JSON.stringify({ location: 'app/sitemap.ts:16', message: 'Before database query', data: {}, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'B' }) + '\n', { flag: 'a' }) } catch (e) { }
    // #endregion

    games = await db.game.findMany({
      where: { inStock: true },
      select: { slug: true, updatedAt: true },
    })

    // #region agent log
    try { writeFileSync('c:\\Users\\-\\Desktop\\game-store\\.cursor\\debug.log', JSON.stringify({ location: 'app/sitemap.ts:26', message: 'Database query success', data: { gameCount: games.length }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'B' }) + '\n', { flag: 'a' }) } catch (e) { }
    // #endregion
  } catch (error) {
    // #region agent log
    try { writeFileSync('c:\\Users\\-\\Desktop\\game-store\\.cursor\\debug.log', JSON.stringify({ location: 'app/sitemap.ts:32', message: 'Database query failed', data: { error: error instanceof Error ? error.message : 'unknown' }, timestamp: Date.now(), sessionId: 'debug-session', hypothesisId: 'B' }) + '\n', { flag: 'a' }) } catch (e) { }
    // #endregion
    console.warn('Sitemap: Database not available during build, skipping game routes')
  }

  const gameRoutes = games.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: game.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...gameRoutes,
  ]
}