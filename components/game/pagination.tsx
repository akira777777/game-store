"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  const pages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | "ellipsis")[] = []

    if (currentPage <= 3) {
      // Show first 5 pages, ellipsis, last page
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push("ellipsis")
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Show first page, ellipsis, last 5 pages
      pages.push(1)
      pages.push("ellipsis")
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
      pages.push(1)
      pages.push("ellipsis")
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push("ellipsis")
      pages.push(totalPages)
    }

    return pages
  }, [currentPage, totalPages])

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    params.set("page", page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav aria-label="Пагинация страниц" className="flex items-center justify-center gap-2">
      <Link href={buildUrl(Math.max(1, currentPage - 1))}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Предыдущая</span>
        </Button>
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-10 w-10 items-center justify-center"
                aria-hidden="true"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            )
          }

          const isCurrentPage = page === currentPage

          return (
            <Link key={page} href={buildUrl(page)}>
              <Button
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                className={isCurrentPage ? "pointer-events-none" : ""}
                aria-label={`Страница ${page}`}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {page}
              </Button>
            </Link>
          )
        })}
      </div>

      <Link href={buildUrl(Math.min(totalPages, currentPage + 1))}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          aria-label="Следующая страница"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Следующая</span>
        </Button>
      </Link>
    </nav>
  )
}
