// Mock data for frontend-only mode (no database)

export interface Game {
  id: string
  title: string
  slug: string
  description: string
  price: number
  discountPrice: number | null
  images: string
  releaseDate: Date | null
  developer: string | null
  publisher: string | null
  platforms: string
  genres: string
  featured: boolean
  inStock: boolean
  stockQuantity: number
  createdAt: Date
  updatedAt: Date
}

export interface PaymentCard {
  id: string
  title: string
  slug: string
  description: string | null
  cardType: string
  region: string | null
  currency: string | null
  denomination: number | null
  price: number
  discountPrice: number | null
  images: string
  featured: boolean
  inStock: boolean
  stockQuantity: number
  createdAt: Date
  updatedAt: Date
}

// Mock games data
export const mockGames: Game[] = [
  {
    id: "1",
    title: "Cyberpunk Adventure",
    slug: "cyberpunk-adventure",
    description: "An immersive cyberpunk RPG set in a dystopian future",
    price: 59.99,
    discountPrice: 39.99,
    images: JSON.stringify(["/placeholder-game.jpg"]),
    releaseDate: new Date("2024-01-15"),
    developer: "Neon Studios",
    publisher: "Digital Games",
    platforms: JSON.stringify(["PC", "PlayStation", "Xbox"]),
    genres: JSON.stringify(["RPG", "Action"]),
    featured: true,
    inStock: true,
    stockQuantity: 100,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Space Explorer",
    slug: "space-explorer",
    description: "Explore the cosmos in this epic space adventure",
    price: 49.99,
    discountPrice: null,
    images: JSON.stringify(["/placeholder-game.jpg"]),
    releaseDate: new Date("2024-02-20"),
    developer: "Cosmos Games",
    publisher: "Space Interactive",
    platforms: JSON.stringify(["PC", "PlayStation"]),
    genres: JSON.stringify(["Adventure", "Simulation"]),
    featured: true,
    inStock: true,
    stockQuantity: 75,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    title: "Racing Champions",
    slug: "racing-champions",
    description: "High-speed racing action with realistic physics",
    price: 39.99,
    discountPrice: 29.99,
    images: JSON.stringify(["/placeholder-game.jpg"]),
    releaseDate: new Date("2024-03-05"),
    developer: "Speed Studios",
    publisher: "Racing Games Inc",
    platforms: JSON.stringify(["PC", "Xbox", "Nintendo"]),
    genres: JSON.stringify(["Racing", "Sports"]),
    featured: false,
    inStock: true,
    stockQuantity: 150,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
]

// Mock payment cards data
export const mockPaymentCards: PaymentCard[] = [
  {
    id: "1",
    title: "Steam Gift Card $50",
    slug: "steam-gift-card-50",
    description: "Steam digital gift card - $50 USD",
    cardType: "Steam",
    region: "Global",
    currency: "USD",
    denomination: 50,
    price: 50,
    discountPrice: null,
    images: JSON.stringify(["/placeholder-card.jpg"]),
    featured: true,
    inStock: true,
    stockQuantity: 500,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "PlayStation Store $25",
    slug: "playstation-store-25",
    description: "PlayStation Store digital card - $25 USD",
    cardType: "PlayStation",
    region: "US",
    currency: "USD",
    denomination: 25,
    price: 25,
    discountPrice: 22.99,
    images: JSON.stringify(["/placeholder-card.jpg"]),
    featured: true,
    inStock: true,
    stockQuantity: 300,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
]
