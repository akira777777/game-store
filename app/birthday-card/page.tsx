"use client"

import { BirthdayCard } from "./components/birthday-card"
import { Fireworks, FireworksHandle } from "./components/fireworks"
import { Gnome } from "./components/gnome"
import { useCallback, useEffect, useRef, useState } from "react"

const GNOME_COUNT = 4
const CLICKS_NEEDED = 10

interface GnomePosition {
  id: number
  x: number
  y: number
}

export default function BirthdayCardPage() {
  const [clickCount, setClickCount] = useState(0)
  const [gnomes, setGnomes] = useState<GnomePosition[]>([])
  const [showCard, setShowCard] = useState(false)
  const [gnomesVisible, setGnomesVisible] = useState(true)
  const fireworksRef = useRef<FireworksHandle>(null)

  // Generate random position for gnomes
  const generateRandomPosition = useCallback((index: number): GnomePosition => {
    if (typeof window === "undefined") {
      return { id: index, x: 200, y: 200 }
    }

    const padding = Math.max(150, window.innerWidth * 0.1)
    const maxX = window.innerWidth - padding * 2
    const maxY = window.innerHeight - padding * 2

    return {
      id: index,
      x: padding + Math.random() * Math.max(maxX, 100),
      y: padding + Math.random() * Math.max(maxY, 100),
    }
  }, [])

  // Initialize gnomes
  useEffect(() => {
    const initialGnomes: GnomePosition[] = []
    for (let i = 0; i < GNOME_COUNT; i++) {
      initialGnomes.push(generateRandomPosition(i))
    }
    setGnomes(initialGnomes)

    // Handle window resize
    const handleResize = () => {
      setGnomes((prev) => {
        return prev.map((gnome) => generateRandomPosition(gnome.id))
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [generateRandomPosition])

  const handleGnomeClick = useCallback(
    (clickX: number, clickY: number, gnomeId?: number) => {
      if (showCard || !gnomesVisible) return

      const newCount = clickCount + 1
      setClickCount(newCount)

      // Launch fireworks at click position
      if (fireworksRef.current) {
        fireworksRef.current.launch(clickX, clickY, 50)
      }

      // If reached target clicks, show card
      if (newCount >= CLICKS_NEEDED) {
        setGnomesVisible(false)

        // Launch big fireworks show
        setTimeout(() => {
          if (fireworksRef.current) {
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2

            // Launch multiple fireworks in sequence
            for (let i = 0; i < 8; i++) {
              setTimeout(() => {
                if (fireworksRef.current) {
                  const angle = (Math.PI * 2 * i) / 8
                  const distance = 150
                  fireworksRef.current.launch(
                    centerX + Math.cos(angle) * distance,
                    centerY + Math.sin(angle) * distance,
                    80
                  )
                }
              }, i * 200)
            }

            // Launch center firework
            setTimeout(() => {
              if (fireworksRef.current) {
                fireworksRef.current.launch(centerX, centerY, 120)
              }
              setShowCard(true)
            }, 1600)
          }
        }, 300)
      } else {
        // Move clicked gnome to new position after animation
        setTimeout(() => {
          setGnomes((prev) => {
            const newGnomes = [...prev]
            // Find gnome closest to click position, or use provided ID
            let gnomeToMove = prev[0]
            if (gnomeId !== undefined) {
              gnomeToMove = prev.find((g) => g.id === gnomeId) || prev[0]
            } else {
              // Find closest gnome to click position
              let minDistance = Infinity
              for (const gnome of prev) {
                const distance = Math.sqrt(
                  Math.pow(gnome.x - clickX, 2) + Math.pow(gnome.y - clickY, 2)
                )
                if (distance < minDistance) {
                  minDistance = distance
                  gnomeToMove = gnome
                }
              }
            }

            // Update the gnome position
            const index = newGnomes.findIndex((g) => g.id === gnomeToMove.id)
            if (index !== -1) {
              newGnomes[index] = generateRandomPosition(gnomeToMove.id)
            }
            return newGnomes
          })
        }, 700) // Wait for bounce animation to complete
      }
    },
    [clickCount, showCard, gnomesVisible, generateRandomPosition]
  )

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => {
          const delay = Math.random() * 2
          const duration = 2 + Math.random() * 3
          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: Math.random() * 0.5 + 0.2,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>

      {/* Fireworks canvas */}
      <Fireworks ref={fireworksRef} />

      {/* Progress indicator */}
      {!showCard && gnomesVisible && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 bg-black/50 backdrop-blur-md rounded-full px-6 py-3 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30">
          <p className="text-white text-lg font-semibold">
            Найдено гномиков: <span className="text-yellow-400">{clickCount}</span> / {CLICKS_NEEDED}
          </p>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(clickCount / CLICKS_NEEDED) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Gnomes */}
      {gnomes.map((gnome) => (
        <Gnome
          key={`gnome-${gnome.id}-${gnome.x}-${gnome.y}`}
          id={gnome.id}
          x={gnome.x}
          y={gnome.y}
          onClick={handleGnomeClick}
          isVisible={gnomesVisible}
        />
      ))}

      {/* Birthday card */}
      <BirthdayCard isVisible={showCard} />

      {/* Instructions (only shown initially) */}
      {clickCount === 0 && !showCard && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-black/50 backdrop-blur-md rounded-2xl px-8 py-4 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30 animate-fade-in">
          <p className="text-white text-xl font-semibold text-center">
            🎯 Найди и кликни на всех гномиков!
          </p>
        </div>
      )}
    </div>
  )
}
