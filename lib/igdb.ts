/**
 * IGDB API Client
 * 
 * This module provides functions to interact with the IGDB (Internet Game Database) API
 * to fetch game metadata, images, and other information.
 * 
 * To use this API:
 * 1. Register at https://www.igdb.com/api
 * 2. Create a Twitch app at https://dev.twitch.tv/console/apps
 * 3. Get your Client ID and Client Secret
 * 4. Add them to your .env file:
 *    IGDB_CLIENT_ID=your_client_id
 *    IGDB_CLIENT_SECRET=your_client_secret
 * 
 * @see https://api-docs.igdb.com/
 */

interface IGDBTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface IGDBCover {
  id: number
  image_id: string
}

interface IGDBScreenshot {
  id: number
  image_id: string
}

interface IGDBGame {
  id: number
  name: string
  slug: string
  summary?: string
  storyline?: string
  cover?: IGDBCover
  screenshots?: IGDBScreenshot[]
  genres?: Array<{ id: number; name: string }>
  platforms?: Array<{ id: number; name: string }>
  involved_companies?: Array<{
    company: { id: number; name: string }
    developer: boolean
    publisher: boolean
  }>
  first_release_date?: number
  rating?: number
  aggregated_rating?: number
}

interface IGDBPlatformMapping {
  [key: number]: string
}

interface IGDBGenreMapping {
  [key: number]: string
}

/**
 * IGDB Platform ID to internal platform mapping
 * Based on IGDB platform IDs (https://api-docs.igdb.com/#tag-Platform)
 */
const IGDB_PLATFORM_MAPPING: IGDBPlatformMapping = {
  6: 'PC', // PC (Microsoft Windows)
  48: 'PLAYSTATION', // PlayStation 4
  49: 'PLAYSTATION', // PlayStation 5
  130: 'NINTENDO_SWITCH', // Nintendo Switch
  12: 'XBOX', // Xbox 360
  11: 'XBOX', // Xbox
  169: 'XBOX', // Xbox Series X|S
  39: 'MOBILE', // iOS
  34: 'MOBILE', // Android
}

/**
 * IGDB Genre ID to internal genre mapping
 * Based on IGDB genre IDs (https://api-docs.igdb.com/#tag-Genre)
 */
const IGDB_GENRE_MAPPING: IGDBGenreMapping = {
  31: 'ADVENTURE', // Adventure
  33: 'ARCADE', // Arcade
  4: 'ACTION', // Fighting
  5: 'ACTION', // Shooter
  11: 'STRATEGY', // Strategy
  12: 'RPG', // RPG
  14: 'SIMULATION', // Simulation
  15: 'SPORTS', // Sports
  16: 'PUZZLE', // Puzzle
  24: 'TACTICAL', // Tactical
  25: 'HACK_AND_SLASH', // Hack and slash
  26: 'QUIZ', // Quiz/Trivia
  30: 'PINBALL', // Pinball
  32: 'INDIE', // Indie
}

const IGDB_API_URL = 'https://api.igdb.com/v4'
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token'

let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * Get OAuth token from Twitch for IGDB API access
 * Token is cached until expiration
 */
async function getIGDBAuthToken(): Promise<string> {
  const clientId = process.env.IGDB_CLIENT_ID
  const clientSecret = process.env.IGDB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      'IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be set in environment variables'
    )
  }

  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  })

  const response = await fetch(`${TWITCH_AUTH_URL}?${params}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(
      `Failed to get IGDB auth token: ${response.status} ${response.statusText}`
    )
  }

  const data: IGDBTokenResponse = await response.json()

  // Cache token (expire 5 minutes before actual expiration for safety)
  const expiresAt = Date.now() + (data.expires_in - 300) * 1000
  cachedToken = {
    token: data.access_token,
    expiresAt,
  }

  return data.access_token
}

/**
 * Convert IGDB image ID to URL
 * @param imageId - IGDB image ID (hash)
 * @param size - Image size (cover_big, screenshot_big, etc.)
 * @returns Full URL to the image
 */
export function getIGDBImageUrl(imageId: string, size: string = 'cover_big'): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`
}

/**
 * Convert IGDB platform IDs to internal platform format
 */
function mapIGDBPlatforms(platforms?: Array<{ id: number; name: string }>): string[] {
  if (!platforms) return []
  
  const mapped = new Set<string>()
  for (const platform of platforms) {
    const internal = IGDB_PLATFORM_MAPPING[platform.id]
    if (internal) {
      mapped.add(internal)
    }
  }
  
  return Array.from(mapped)
}

/**
 * Convert IGDB genre IDs to internal genre format
 */
function mapIGDBGenres(genres?: Array<{ id: number; name: string }>): string[] {
  if (!genres) return []
  
  const mapped = new Set<string>()
  for (const genre of genres) {
    const internal = IGDB_GENRE_MAPPING[genre.id]
    if (internal) {
      mapped.add(internal)
    }
  }
  
  return Array.from(mapped)
}

/**
 * Search for games by name
 * @param query - Game name to search for
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of game data
 */
export async function searchGames(query: string, limit: number = 10): Promise<IGDBGame[]> {
  try {
    const token = await getIGDBAuthToken()

    const body = `
      search "${query}";
      fields id,name,slug,summary,storyline,cover.image_id,screenshots.image_id,genres.name,platforms.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,first_release_date,rating,aggregated_rating;
      limit ${limit};
    `

    const response = await fetch(`${IGDB_API_URL}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body,
    })

    if (!response.ok) {
      throw new Error(
        `IGDB API error: ${response.status} ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error && error.message.includes('IGDB_CLIENT_ID')) {
      // If credentials are not configured, return empty array
      // This allows the application to work without IGDB API
      console.warn('IGDB API not configured. Skipping API call.')
      return []
    }
    throw error
  }
}

/**
 * Get game by slug
 * @param slug - Game slug (e.g., 'cyberpunk-2077')
 * @returns Game data or null if not found
 */
export async function getGameBySlug(slug: string): Promise<IGDBGame | null> {
  try {
    const token = await getIGDBAuthToken()

    const body = `
      fields id,name,slug,summary,storyline,cover.image_id,screenshots.image_id,genres.name,platforms.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,first_release_date,rating,aggregated_rating;
      where slug = "${slug}";
      limit 1;
    `

    const response = await fetch(`${IGDB_API_URL}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body,
    })

    if (!response.ok) {
      throw new Error(
        `IGDB API error: ${response.status} ${response.statusText}`
      )
    }

    const games: IGDBGame[] = await response.json()
    return games[0] || null
  } catch (error) {
    if (error instanceof Error && error.message.includes('IGDB_CLIENT_ID')) {
      console.warn('IGDB API not configured. Skipping API call.')
      return null
    }
    throw error
  }
}

/**
 * Transform IGDB game data to format compatible with our database schema
 */
export function transformIGDBGame(game: IGDBGame): {
  title: string
  slug: string
  description: string
  images: string[]
  platforms: string[]
  genres: string[]
  developer: string | null
  publisher: string | null
  releaseDate: Date | null
} {
  const images: string[] = []
  
  if (game.cover?.image_id) {
    images.push(getIGDBImageUrl(game.cover.image_id, 'cover_big'))
  }
  
  if (game.screenshots) {
    for (const screenshot of game.screenshots.slice(0, 3)) {
      if (screenshot.image_id) {
        images.push(getIGDBImageUrl(screenshot.image_id, 'screenshot_big'))
      }
    }
  }

  const description = game.summary || game.storyline || 'Описание игры отсутствует.'

  const developerCompany = game.involved_companies?.find(c => c.developer)
  const publisherCompany = game.involved_companies?.find(c => c.publisher)

  const releaseDate = game.first_release_date
    ? new Date(game.first_release_date * 1000)
    : null

  return {
    title: game.name,
    slug: game.slug,
    description,
    images,
    platforms: mapIGDBPlatforms(game.platforms),
    genres: mapIGDBGenres(game.genres),
    developer: developerCompany?.company?.name || null,
    publisher: publisherCompany?.company?.name || null,
    releaseDate,
  }
}

/**
 * Get game data formatted for database insertion
 * Combines API call and transformation
 */
export async function fetchGameData(slug: string) {
  const game = await getGameBySlug(slug)
  if (!game) {
    return null
  }
  return transformIGDBGame(game)
}
