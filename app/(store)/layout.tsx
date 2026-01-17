import { Navigation } from "@/components/layout/navigation"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
    </>
  )
}
