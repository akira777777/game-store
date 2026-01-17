"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Gnome } from "@/components/birthday/gnome"
import { Fireworks, FireworksHandle } from "@/components/birthday/fireworks"
import { BirthdayCard } from "@/components/birthday/birthday-card"

const GNOME_COUNT = 4
const CLICKS_NEEDED = 10

interface GnomePosition {
  id: number
  x: number
  y: number
}

export default function BirthdayPage() {
  const [clickCount, setClickCount] = useState(0)
  const [gnomes, setGnomes] = useState<GnomePosition[]>([])
  const [showCard, setShowCard] = useState(false)
  const [gnomesVisible, setGnomesVisible] = useState(true)
  const fireworksRef = useRef<FireworksHandle>(null)

  // Generate random position for gnomes
  const generateRandomPosition = useCallback((index: number): GnomePosition => {
    const padding = 150
    return {
      id: index,
      x: padding + Math.random() * (typeof window !== "undefined" ? window.innerWidth - padding * 2 : 800),
      y: padding + Math.random() * (typeof window !== "undefined" ? window.innerHeight - padding * 2 : 600),
    }
  }, [])

  // Initialize gnomes
  useEffect(() => {
    const initialGnomes: GnomePosition[] = []
    for (let i = 0; i < GNOME_COUNT; i++) {
      initialGnomes.push(generateRandomPosition(i))
    }
    setGnomes(initialGnomes)
  }, [generateRandomPosition])

  const handleGnomeClick = useCallback(
    (x: number, y: number) => {
      if (showCard || !gnomesVisible) return

      const newCount = clickCount + 1
      setClickCount(newCount)

      // Launch fireworks at click position
      if (fireworksRef.current) {
        fireworksRef.current.launch(x, y, 40)
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
                fireworksRef.current.launch(centerX, centerY, 100)
              }
              setShowCard(true)
            }, 1600)
          }
        }, 300)
      } else {
        // Move clicked gnome to new position
        setTimeout(() => {
          setGnomes((prev) => {
            const newGnomes = [...prev]
            const randomIndex = Math.floor(Math.random() * newGnomes.length)
            newGnomes[randomIndex] = generateRandomPosition(newGnomes[randomIndex].id)
            return newGnomes
          })
        }, 400)
      }
    },
    [clickCount, showCard, gnomesVisible, generateRandomPosition]
  )

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.5 + 0.2,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Fireworks canvas */}
      <Fireworks ref={fireworksRef} />

      {/* Progress indicator */}
      {!showCard && gnomesVisible && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md rounded-full px-6 py-3 border-2 border-yellow-400">
          <p className="text-white text-lg font-semibold">
            Найдено гномиков: {clickCount} / {CLICKS_NEEDED}
          </p>
        </div>
      )}

      {/* Gnomes */}
      {gnomes.map((gnome) => (
        <Gnome
          key={gnome.id}
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
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-black/40 backdrop-blur-md rounded-2xl px-8 py-4 border-2 border-yellow-400 animate-fade-in">
          <p className="text-white text-xl font-semibold text-center">
            🎯 Найди и кликни на всех гномиков!
          </p>
        </div>
      )}
    </div>
  )
}
