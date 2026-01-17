import { SessionProvider } from "@/components/providers/session-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Game Store - Интернет-магазин видеоигр",
  description: "Современный интернет-магазин видеоигр для всех платформ",
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
