import { Footer } from "@/components/layout/footer"
import { Navigation } from "@/components/layout/navigation"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow"
      >
        Перейти к содержимому
      </a>
      <Navigation />
      <div id="main-content" tabIndex={-1} className="flex-1">
        {children}
      </div>
      <Footer />
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Game Store",
            description: "Современный интернет-магазин видеоигр для всех платформ",
            url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/games?search={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  )
}