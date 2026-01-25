"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

interface ImageArrayInputProps {
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function ImageArrayInput({ values, onChange, placeholder }: ImageArrayInputProps) {
  const images = Array.isArray(values) ? values : []

  const addImage = () => {
    onChange([...images, ""])
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const updateImage = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      {images.map((url, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => updateImage(index, e.target.value)}
            placeholder={placeholder || "https://example.com/image.jpg"}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeImage(index)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addImage}
        className="mt-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        Добавить изображение
      </Button>
    </div>
  )
}
