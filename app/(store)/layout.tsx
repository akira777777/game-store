import { Footer } from "@/components/layout/footer"
import { Navigation } from "@/components/layout/navigation"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div id="main-content" tabIndex={-1} className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}
