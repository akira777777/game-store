import { SessionProvider } from "@/components/providers/session-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: {
    default: "Game Store - Интернет-магазин видеоигр",
    template: "%s | Game Store",
  },
  description: "Современный интернет-магазин видеоигр для всех платформ. Эксклюзивные скидки и мгновенная доставка цифровых копий.",
  keywords: ["игры", "видеоигры", "игровой магазин", "цифровые игры", "steam", "epic games", "playstation", "xbox", "nintendo"],
  authors: [{ name: "Game Store" }],
  creator: "Game Store",
  publisher: "Game Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Game Store",
    title: "Game Store - Интернет-магазин видеоигр",
    description: "Современный интернет-магазин видеоигр для всех платформ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Store - Интернет-магазин видеоигр",
    description: "Современный интернет-магазин видеоигр для всех платформ",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Перейти к основному содержимому
        </a>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
