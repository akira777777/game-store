"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RangeSliderProps {
  min?: number
  max?: number
  value?: [number, number]
  onValueChange?: (value: [number, number]) => void
  step?: number
  className?: string
}

export function RangeSlider({
  min = 0,
  max = 1000,
  value = [min, max],
  onValueChange,
  step = 1,
  className,
}: RangeSliderProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (newMin: number) => {
    const newValue: [number, number] = [Math.max(min, Math.min(max, newMin)), localValue[1]]
    if (newValue[0] > newValue[1]) {
      newValue[1] = newValue[0]
    }
    setLocalValue(newValue)
    onValueChange?.(newValue)
  }

  const handleMaxChange = (newMax: number) => {
    const newValue: [number, number] = [localValue[0], Math.max(min, Math.min(max, newMax))]
    if (newValue[1] < newValue[0]) {
      newValue[0] = newValue[1]
    }
    setLocalValue(newValue)
    onValueChange?.(newValue)
  }

  const minPercent = ((localValue[0] - min) / (max - min)) * 100
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative h-2 w-full rounded-full bg-secondary">
        <div
          className="absolute h-2 rounded-full bg-primary"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>
      <div className="relative mt-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute w-full h-2 bg-transparent cursor-pointer"
          style={{
            zIndex: localValue[0] > max - (max - min) / 5 ? 5 : 3,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute w-full h-2 bg-transparent cursor-pointer"
          style={{
            zIndex: localValue[1] < min + (max - min) / 5 ? 5 : 3,
          }}
        />
      </div>
    </div>
  )
}
