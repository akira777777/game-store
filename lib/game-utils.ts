// Helper functions for working with JSON-stored arrays and enums in SQLite

export function parseJsonArray<T>(value: string | null | undefined): T[] {
  if (!value) return []
  try {
    return JSON.parse(value) as T[]
  } catch {
    return []
  }
}

export function stringifyJsonArray<T>(value: T[]): string {
  return JSON.stringify(value)
}

export function parseJsonArrayOrString(value: string | null | undefined): string[] {
  if (!value) return []
  if (value.startsWith('[')) {
    return parseJsonArray<string>(value)
  }
  // If it's a comma-separated string, split it
  return value.split(',').map(s => s.trim()).filter(Boolean)
}
