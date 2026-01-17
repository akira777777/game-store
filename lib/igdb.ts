/**
 * IGDB API integration module
 *
 * Provides functions to fetch game data from IGDB (Internet Game Database)
 * Requires Twitch OAuth credentials (free tier available)
 *
 * Documentation: https://api-docs.igdb.com/
 */

interface IGDBGame {
  id: number
  name: string
  slug: string
  summary?: string
  cover?: { image_id: string }
  screenshots?: Array<{ image_id: string }>
  platforms?: Array<{ id: number; name: string }>
  genres?: Array<{ id: number; name: string }>
  involved_companies?: Array<{
    company: { id: number; name: string }
    developer: boolean
    publisher: boolean
  }>
  first_release_date?: number
  aggregated_rating?: number
}

interface IGDBTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

/**
 * Platform mapping from IGDB IDs to our platform enum values
 */
const PLATFORM_MAP: Record<number, string> = {
  6: 'PC', // PC (Microsoft Windows)
  8: 'PLAYSTATION', // PlayStation
  3: 'PLAYSTATION', // PlayStation 2
  39: 'PLAYSTATION', // PlayStation 3
  48: 'PLAYSTATION', // PlayStation 4
  167: 'PLAYSTATION', // PlayStation 5
  11: 'XBOX', // Xbox
  12: 'XBOX', // Xbox 360
  49: 'XBOX', // Xbox One
  169: 'XBOX', // Xbox Series X|S
  7: 'NINTENDO_SWITCH', // Nintendo Switch (older ID)
  130: 'NINTENDO_SWITCH', // Nintendo Switch
  37: 'NINTENDO_SWITCH', // Nintendo 3DS
  34: 'MOBILE', // Android
  41: 'MOBILE', // iOS
}

/**
 * Genre mapping from IGDB IDs to our genre enum values
 */
const GENRE_MAP: Record<number, string> = {
  2: 'POINT_AND_CLICK', // Point-and-click
  4: 'FIGHTING', // Fighting
  5: 'SHOOTER', // Shooter
  7: 'MUSIC', // Music
  8: 'PLATFORM', // Platform
  9: 'PUZZLE', // Puzzle
  10: 'RACING', // Racing
  11: 'RTS', // Real Time Strategy (RTS)
  12: 'RPG', // Role-playing (RPG)
  13: 'SIMULATION', // Simulator
  14: 'SPORTS', // Sport
  15: 'STRATEGY', // Strategy
  16: 'TURN_BASED_STRATEGY', // Turn-based strategy (TBS)
  24: 'TACTICAL', // Tactical
  25: 'HACK_AND_SLASH', // Hack and slash/Beat 'em up
  26: 'QUIZ_TRIVIA', // Quiz/Trivia
  30: 'PINBALL', // Pinball
  31: 'ADVENTURE', // Adventure
  32: 'INDIE', // Indie
  33: 'ARCADE', // Arcade
  34: 'VISUAL_NOVEL', // Visual Novel
  35: 'CARD_BATTLE', // Card & Board Game
}

let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * Gets OAuth token from Twitch for IGDB API access
 * Tokens are cached to avoid unnecessary requests
 */
async function getIGDBAuthToken(): Promise<string> {
  const clientId = process.env.IGDB_CLIENT_ID
  const clientSecret = process.env.IGDB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be set in environment variables')
  }

  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get IGDB token: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as IGDBTokenResponse
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000 // Subtract 60s buffer

  cachedToken = {
    token: data.access_token,
    expiresAt,
  }

  return data.access_token
}

/**
 * Formats IGDB image ID to full URL
 *
 * @param imageId - IGDB image hash
 * @param size - Image size variant (cover_big, screenshot_big, etc.)
 * @returns Full URL to the image
 */
export function formatIGDBImageUrl(imageId: string, size: string = 'cover_big'): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`
}

/**
 * Fetches game data from IGDB by slug
 *
 * @param slug - Game slug (e.g., 'cyberpunk-2077')
 * @returns Game data from IGDB or null if not found
 */
export async function fetchGameBySlug(slug: string): Promise<IGDBGame | null> {
  try {
    const token = await getIGDBAuthToken()
    const clientId = process.env.IGDB_CLIENT_ID

    if (!clientId) {
      throw new Error('IGDB_CLIENT_ID must be set')
    }

    const query = `
      fields name,slug,summary,cover.image_id,screenshots.image_id,
             platforms.id,platforms.name,genres.id,genres.name,
             involved_companies.company.id,involved_companies.company.name,
             involved_companies.developer,involved_companies.publisher,
             first_release_date,aggregated_rating;
      where slug="${slug}";
      limit 1;
    `

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: query,
    })

    if (!response.ok) {
      if (response.status === 404 || response.status === 429) {
        return null
      }
      const errorText = await response.text()
      throw new Error(`IGDB API error: ${response.status} ${errorText}`)
    }

    const games = (await response.json()) as IGDBGame[]
    return games.length > 0 ? games[0] : null
  } catch (error) {
    console.error(`Error fetching game ${slug} from IGDB:`, error)
    return null
  }
}

/**
 * Converts IGDB game data to our database format
 *
 * @param igdbGame - Game data from IGDB
 * @param fallbackPrice - Price to use if not available from IGDB
 * @returns Game data in our database format
 */
export function convertIGDBGameToDbFormat(
  igdbGame: IGDBGame,
  fallbackPrice: number = 29.99
): {
  title: string
  slug: string
  description: string
  price: number
  images: string[]
  platforms: string[]
  genres: string[]
  developer: string | null
  publisher: string | null
  releaseDate: Date | null
} {
  // Extract images
  const images: string[] = []
  if (igdbGame.cover?.image_id) {
    images.push(formatIGDBImageUrl(igdbGame.cover.image_id, 'cover_big'))
  }
  if (igdbGame.screenshots) {
    igdbGame.screenshots.slice(0, 3).forEach((screenshot) => {
      if (screenshot.image_id) {
        images.push(formatIGDBImageUrl(screenshot.image_id, 'screenshot_big'))
      }
    })
  }

  // Extract platforms
  const platforms: string[] = []
  if (igdbGame.platforms) {
    const uniquePlatforms = new Set<string>()
    igdbGame.platforms.forEach((platform) => {
      const mappedPlatform = PLATFORM_MAP[platform.id]
      if (mappedPlatform) {
        uniquePlatforms.add(mappedPlatform)
      }
    })
    platforms.push(...Array.from(uniquePlatforms))
  }

  // Extract genres
  const genres: string[] = []
  if (igdbGame.genres) {
    const uniqueGenres = new Set<string>()
    igdbGame.genres.forEach((genre) => {
      const mappedGenre = GENRE_MAP[genre.id] || 'ACTION' // Default fallback
      uniqueGenres.add(mappedGenre)
    })
    genres.push(...Array.from(uniqueGenres))
  }

  // Extract developer and publisher
  let developer: string | null = null
  let publisher: string | null = null
  if (igdbGame.involved_companies) {
    for (const company of igdbGame.involved_companies) {
      if (company.developer && !developer) {
        developer = company.company.name
      }
      if (company.publisher && !publisher) {
        publisher = company.company.name
      }
    }
  }

  // Convert release date
  let releaseDate: Date | null = null
  if (igdbGame.first_release_date) {
    releaseDate = new Date(igdbGame.first_release_date * 1000)
  }

  return {
    title: igdbGame.name,
    slug: igdbGame.slug,
    description: igdbGame.summary || `${igdbGame.name} - захватывающая игра для всех платформ`,
    price: fallbackPrice,
    images: images.length > 0 ? images : [],
    platforms: platforms.length > 0 ? platforms : ['PC'],
    genres: genres.length > 0 ? genres : ['ACTION'],
    developer,
    publisher,
    releaseDate,
  }
}

/**
 * Checks if IGDB credentials are configured
 */
export function isIGDBConfigured(): boolean {
  return !!process.env.IGDB_CLIENT_ID && !!process.env.IGDB_CLIENT_SECRET
}
