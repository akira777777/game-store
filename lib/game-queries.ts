/**
 * Shared query utilities for game-related database operations
 * Reduces code duplication and ensures consistent query patterns
 */

import { Prisma } from '@prisma/client'
import { db } from './db'

export interface GameQueryParams {
  genre?: string | null
  platform?: string | null
  search?: string
  minPrice?: string | null
  maxPrice?: string | null
  featured?: boolean
  inStock?: boolean
}

export interface GameSortParams {
  sortBy?: string
  order?: 'asc' | 'desc'
}

/**
 * Builds Prisma where conditions for game queries
 */
export function buildGameWhereConditions(
  params: GameQueryParams
): Prisma.GameWhereInput {
  const whereConditions: Prisma.GameWhereInput = {
    inStock: params.inStock !== undefined ? params.inStock : true,
  }

  // Filter by featured
  if (params.featured === true) {
    whereConditions.featured = true
  }

  // Filter by genre using PostgreSQL JSON contains
  if (params.genre?.trim()) {
    whereConditions.genres = {
      contains: `"${params.genre.trim()}"`,
    }
  }

  // Filter by platform using PostgreSQL JSON contains
  if (params.platform?.trim()) {
    whereConditions.platforms = {
      contains: `"${params.platform.trim()}"`,
    }
  }

  // Filter by search in title or description (case-insensitive)
  if (params.search?.trim()) {
    whereConditions.OR = [
      {
        title: {
          contains: params.search.trim(),
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: params.search.trim(),
          mode: 'insensitive',
        },
      },
    ]
  }

  // Filter by price range (considering discountPrice when available)
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : null
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null

  if (minPrice !== null || maxPrice !== null) {
    const priceFilters: Prisma.GameWhereInput[] = []

    if (minPrice !== null && !isNaN(minPrice) && minPrice >= 0) {
      priceFilters.push({
        OR: [
          { discountPrice: { gte: minPrice } },
          {
            AND: [
              { discountPrice: null },
              { price: { gte: minPrice } },
            ],
          },
        ],
      })
    }

    if (maxPrice !== null && !isNaN(maxPrice) && maxPrice >= 0) {
      priceFilters.push({
        OR: [
          { discountPrice: { lte: maxPrice } },
          {
            AND: [
              { discountPrice: null },
              { price: { lte: maxPrice } },
            ],
          },
        ],
      })
    }

    if (priceFilters.length > 0) {
      const existingAnd = whereConditions.AND
      const andArray = Array.isArray(existingAnd)
        ? existingAnd
        : existingAnd
          ? [existingAnd]
          : []
      whereConditions.AND = [...andArray, ...priceFilters]
    }
  }

  return whereConditions
}

/**
 * Builds orderBy clause for game queries
 * Note: Price sorting uses discountPrice ?? price logic
 */
export function buildGameOrderBy(
  sortBy?: string,
  order: 'asc' | 'desc' = 'desc'
): Prisma.GameOrderByWithRelationInput {
  const sortByParam = sortBy || 'createdAt'

  switch (sortByParam) {
    case 'newest':
    case 'createdAt':
      return { createdAt: order }
    case 'oldest':
      return { createdAt: 'asc' }
    case 'price_asc':
      return { price: 'asc' }
    case 'price_desc':
      return { price: 'desc' }
    case 'title':
      return { title: order }
    case 'updatedAt':
      return { updatedAt: order }
    default:
      return { createdAt: 'desc' }
  }
}

/**
 * Fetches games with pagination
 */
export async function fetchGamesPaginated(
  params: GameQueryParams & GameSortParams & {
    page?: number
    limit?: number
  }
) {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(100, Math.max(1, params.limit || 12))
  const skip = (page - 1) * limit

  const whereConditions = buildGameWhereConditions(params)
  const orderBy = buildGameOrderBy(params.sortBy, params.order)

  const [games, total] = await Promise.all([
    db.game.findMany({
      where: whereConditions,
      orderBy,
      skip,
      take: limit,
    }),
    db.game.count({
      where: whereConditions,
    }),
  ])

  // Post-process sorting for price (when sorting by price, need to consider discountPrice)
  // This is a limitation of Prisma - we can't use COALESCE in orderBy directly
  if (params.sortBy === 'price_asc' || params.sortBy === 'price_desc') {
    games.sort((a, b) => {
      const finalPriceA = a.discountPrice ?? a.price
      const finalPriceB = b.discountPrice ?? b.price
      return params.sortBy === 'price_asc'
        ? finalPriceA - finalPriceB
        : finalPriceB - finalPriceA
    })
  }

  return {
    games,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}
