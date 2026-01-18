// Utility functions for working with JSON-stored arrays in the database
// These functions provide type-safe operations and handle edge cases

export function parseJsonArray<T = string>(value: string | null | undefined): T[] {
  if (!value) return []
  if (typeof value !== 'string') {
    return Array.isArray(value) ? value : []
  }
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Alias for parseJsonArray for backward compatibility
 * @deprecated Use parseJsonArray or normalizeJsonArray instead
 */
export const parseJsonArrayOrString = parseJsonArray

export function stringifyJsonArray<T>(value: T[] | null | undefined): string {
  if (!value || !Array.isArray(value)) return '[]'
  try {
    return JSON.stringify(value)
  } catch {
    return '[]'
  }
}

/**
 * Normalizes JSON array data - handles both string and array inputs
 * Used when processing API requests that might send either format
 */
export function normalizeJsonArray<T = string>(
  value: string | T[] | null | undefined
): T[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    // Check if it's already JSON
    if (value.trim().startsWith('[')) {
      return parseJsonArray<T>(value)
    }
    // Handle comma-separated strings
    return value.split(',').map((s) => s.trim()).filter(Boolean) as T[]
  }
  return []
}

/**
 * Converts array to database format (always string for JSON fields)
 */
export function toDbJsonArray<T>(value: T[] | string | null | undefined): string {
  if (!value) return '[]'
  if (typeof value === 'string') {
    // If it's already a JSON string, validate and return
    if (value.trim().startsWith('[')) {
      try {
        JSON.parse(value)
        return value
      } catch {
        return '[]'
      }
    }
    // Convert comma-separated to JSON array
    const items = value.split(',').map((s) => s.trim()).filter(Boolean)
    return JSON.stringify(items)
  }
  if (Array.isArray(value)) {
    return stringifyJsonArray(value)
  }
  return '[]'
}

/**
 * Type-safe game data with parsed JSON fields
 */
export type GameWithParsedData = {
  id: string
  title: string
  slug: string
  description: string
  price: number
  discountPrice: number | null
  images: string[]
  releaseDate: Date | null
  developer: string | null
  publisher: string | null
  platforms: string[]
  genres: string[]
  featured: boolean
  inStock: boolean
  stockQuantity: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Parses raw game data from database into type-safe format
 */
export function parseGameData<T extends { images?: unknown; platforms?: unknown; genres?: unknown }>(
  game: T
): Omit<T, 'images' | 'platforms' | 'genres'> & {
  images: string[]
  platforms: string[]
  genres: string[]
} {
  return {
    ...game,
    images: parseJsonArray<string>(game.images as string),
    platforms: parseJsonArray<string>(game.platforms as string),
    genres: parseJsonArray<string>(game.genres as string),
  }
}
/**
 * Formats price to USD currency string
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}
