"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface MultiSelectButtonsProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  label?: string
}

export function MultiSelectButtons({ options, selected, onChange, label }: MultiSelectButtonsProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={selected.includes(option) ? "default" : "outline"}
            onClick={() => toggleOption(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}
