"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentImage = images[selectedIndex]
  const hasMultipleImages = images.length > 1

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      } else if (e.key === "Escape") {
        e.preventDefault()
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen, images.length])

  if (images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center" role="img" aria-label="Изображение недоступно">
        <p className="text-muted-foreground">Нет изображения</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden group">
          <Image
            src={currentImage}
            alt={`${title} - изображение ${selectedIndex + 1} из ${images.length}`}
            fill
            className="object-cover cursor-pointer"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={selectedIndex === 0}
            onClick={() => setIsFullscreen(true)}
          />
          
          {hasMultipleImages && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                aria-label="Предыдущее изображение"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                aria-label="Следующее изображение"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {selectedIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail grid */}
        {hasMultipleImages && images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative aspect-video w-full bg-muted rounded-md overflow-hidden border-2 transition-all",
                  selectedIndex === index
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-transparent hover:border-muted-foreground/50"
                )}
                aria-label={`Показать изображение ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${title} - миниатюра ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Галерея изображений"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setIsFullscreen(false)}
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </Button>

          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                aria-label="Предыдущее изображение"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                aria-label="Следующее изображение"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={currentImage}
              alt={`${title} - изображение ${selectedIndex + 1} из ${images.length}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedIndex(index)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    selectedIndex === index ? "bg-white" : "bg-white/50"
                  )}
                  aria-label={`Перейти к изображению ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
