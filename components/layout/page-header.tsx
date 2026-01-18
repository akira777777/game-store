import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  description?: string
  backUrl?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  backUrl,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8 space-y-4", className)}>
      {backUrl && (
        <Link href={backUrl}>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            aria-label="Вернуться назад"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Назад
          </Button>
        </Link>
      )}
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-muted-foreground text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
