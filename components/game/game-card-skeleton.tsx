import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video w-full bg-muted">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <Skeleton className="h-8 w-20" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}