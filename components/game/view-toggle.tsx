"use client"

import { Button } from "@/components/ui/button"
import { Grid3x3, List } from "lucide-react"
import { useState } from "react"

type ViewMode = "grid" | "list"

interface ViewToggleProps {
  defaultView?: ViewMode
  onViewChange?: (view: ViewMode) => void
}

export function ViewToggle({ defaultView = "grid", onViewChange }: ViewToggleProps) {
  const [view, setView] = useState<ViewMode>(defaultView)

  const handleViewChange = (newView: ViewMode) => {
    setView(newView)
    onViewChange?.(newView)
  }

  return (
    <div className="flex items-center gap-2 border rounded-md p-1 bg-muted/50">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("grid")}
        aria-label="Сетка"
        aria-pressed={view === "grid"}
      >
        <Grid3x3 className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("list")}
        aria-label="Список"
        aria-pressed={view === "list"}
      >
        <List className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
