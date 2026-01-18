import { Skeleton } from "@/components/ui/skeleton"

export default function GamePageLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </main>
  )
}
