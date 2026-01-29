/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A lowercase, hyphenated string suitable for URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}
