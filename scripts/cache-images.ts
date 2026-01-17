/**
 * Image Caching Script
 * 
 * This script downloads game images from external URLs (IGDB, Unsplash, etc.)
 * and optionally uploads them to a CDN or stores them locally.
 * 
 * This is useful for production environments where:
 * - IGDB images may be removed after 30 days
 * - You want faster load times
 * - You need to comply with image licensing requirements
 * 
 * Usage:
 *   npx tsx scripts/cache-images.ts
 * 
 * Environment variables (optional):
 *   IMAGE_CACHE_DIR - Directory to store cached images (default: ./public/images/games)
 *   CDN_URL - CDN base URL if uploading to CDN (optional)
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'

const prisma = new PrismaClient()

const IMAGE_CACHE_DIR = process.env.IMAGE_CACHE_DIR || './public/images/games'
const CDN_URL = process.env.CDN_URL // Optional CDN URL

interface ImageCacheResult {
  gameId: string
  gameTitle: string
  originalUrl: string
  cachedUrl: string
  success: boolean
  error?: string
}

/**
 * Download image from URL and save to local filesystem
 */
async function downloadImage(
  url: string,
  outputPath: string
): Promise<void> {
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get('content-type')
  if (!contentType?.startsWith('image/')) {
    throw new Error(`URL does not point to an image: ${contentType}`)
  }

  // Ensure directory exists
  const dir = path.dirname(outputPath)
  await fs.mkdir(dir, { recursive: true })

  // Download and save
  if (!response.body) {
    throw new Error('Response body is null')
  }

  const buffer = await response.arrayBuffer()
  await fs.writeFile(outputPath, Buffer.from(buffer))
}

/**
 * Get safe filename from URL
 */
function getFilenameFromUrl(url: string, index: number): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const ext = path.extname(pathname) || '.jpg'
    
    // Extract image ID from IGDB URLs
    const igdbMatch = url.match(/\/([a-z0-9]+)\.(jpg|png)$/i)
    if (igdbMatch) {
      return `${igdbMatch[1]}${ext}`
    }
    
    // Fallback: use hash of URL
    const hash = Buffer.from(url).toString('base64').slice(0, 16).replace(/[^a-z0-9]/gi, '')
    return `${hash}-${index}${ext}`
  } catch {
    const hash = Buffer.from(url).toString('base64').slice(0, 16).replace(/[^a-z0-9]/gi, '')
    return `${hash}-${index}.jpg`
  }
}

/**
 * Cache images for a single game
 */
async function cacheGameImages(
  gameId: string,
  gameTitle: string,
  imageUrls: string[]
): Promise<ImageCacheResult[]> {
  const results: ImageCacheResult[] = []

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    const filename = getFilenameFromUrl(url, i)
    const relativePath = path.join(gameId, filename)
    const fullPath = path.join(IMAGE_CACHE_DIR, relativePath)
    const cachedUrl = CDN_URL 
      ? `${CDN_URL}/${relativePath}`
      : `/images/games/${relativePath.replace(/\\/g, '/')}`

    try {
      await downloadImage(url, fullPath)
      results.push({
        gameId,
        gameTitle,
        originalUrl: url,
        cachedUrl,
        success: true,
      })
      console.log(`✓ Cached: ${gameTitle} - ${filename}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      results.push({
        gameId,
        gameTitle,
        originalUrl: url,
        cachedUrl,
        success: false,
        error: errorMessage,
      })
      console.error(`✗ Failed: ${gameTitle} - ${filename}: ${errorMessage}`)
    }
  }

  return results
}

/**
 * Update game images in database with cached URLs
 */
async function updateGameImages(
  gameId: string,
  cachedUrls: string[]
): Promise<void> {
  await prisma.game.update({
    where: { id: gameId },
    data: {
      images: JSON.stringify(cachedUrls),
    },
  })
}

/**
 * Main function
 */
async function main() {
  console.log('Starting image caching...')
  console.log(`Cache directory: ${IMAGE_CACHE_DIR}`)
  if (CDN_URL) {
    console.log(`CDN URL: ${CDN_URL}`)
  }
  console.log('')

  try {
    // Get all games from database
    const games = await prisma.game.findMany({
      select: {
        id: true,
        title: true,
        images: true,
      },
    })

    console.log(`Found ${games.length} games to process\n`)

    const allResults: ImageCacheResult[] = []
    let successCount = 0
    let failCount = 0

    for (const game of games) {
      const imageUrls = JSON.parse(game.images || '[]') as string[]
      
      if (imageUrls.length === 0) {
        console.log(`⚠ Skipping ${game.title}: no images`)
        continue
      }

      const results = await cacheGameImages(game.id, game.title, imageUrls)
      allResults.push(...results)

      // Update game with cached URLs if all images succeeded
      const successfulUrls = results
        .filter(r => r.success)
        .map(r => r.cachedUrl)

      if (successfulUrls.length > 0) {
        await updateGameImages(game.id, successfulUrls)
        successCount += successfulUrls.length
        console.log(`✓ Updated database: ${game.title}\n`)
      } else {
        failCount += imageUrls.length
        console.log(`✗ Failed to cache any images for: ${game.title}\n`)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Summary
    console.log('\n=== Summary ===')
    console.log(`Total images processed: ${allResults.length}`)
    console.log(`Successful: ${successCount}`)
    console.log(`Failed: ${failCount}`)

    if (failCount > 0) {
      console.log('\nFailed images:')
      allResults
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.gameTitle}: ${r.error}`)
        })
    }

  } catch (error) {
    console.error('Error during image caching:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
