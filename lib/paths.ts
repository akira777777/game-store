// Helper to get the correct asset path for GitHub Pages
export function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${normalizedPath}`
}

// Image paths for birthday card
export const BIRTHDAY_CARD_IMAGES = {
  gnomes: [
    '/birthday-card/Слой 2.png',
    '/birthday-card/Слой 3.png',
    '/birthday-card/Слой 4.png',
  ],
  card: '/birthday-card/Слоwdй 2.png',
}
