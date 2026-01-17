"use client"

import { useState, useEffect } from "react"

interface GnomeProps {
  id: number
  x: number
  y: number
  onClick: (x: number, y: number) => void
  isVisible: boolean
}

const gnomeColors = [
  { hat: "#FF6B6B", body: "#4ECDC4", beard: "#95E1D3" },
  { hat: "#FFD93D", body: "#6BCF7F", beard: "#95E1D3" },
  { hat: "#A8E6CF", body: "#FFD93D", beard: "#FFA07A" },
  { hat: "#95E1D3", body: "#F38181", beard: "#AAE3E2" },
  { hat: "#F38181", body: "#FFD93D", beard: "#C7CEEA" },
]

export function Gnome({ id, x, y, onClick, isVisible }: GnomeProps) {
  const [isBouncing, setIsBouncing] = useState(false)
  const [colorSet] = useState(gnomeColors[id % gnomeColors.length])

  const handleClick = () => {
    setIsBouncing(true)
    onClick(x + 60, y + 80) // Center of gnome for fireworks
    setTimeout(() => setIsBouncing(false), 600)
  }

  if (!isVisible) return null

  return (
    <button
      onClick={handleClick}
      className={`absolute cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded-full ${
        isBouncing ? "animate-bounce-gnome" : "animate-pulse-gnome"
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: isBouncing ? "scale(1.2)" : "scale(1)",
      }}
      aria-label={`Click gnome ${id + 1}`}
    >
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        className="drop-shadow-2xl"
      >
        {/* Hat */}
        <path
          d="M20 30 Q20 10 40 10 Q60 10 80 10 Q100 10 100 30 L100 50 Q100 60 90 65 L80 70 L40 70 L30 65 Q20 60 20 50 Z"
          fill={colorSet.hat}
          stroke="#2C3E50"
          strokeWidth="2"
        />
        <circle cx="60" cy="45" r="8" fill="#FFD700" />
        <circle cx="60" cy="35" r="5" fill="#FFD700" />

        {/* Face */}
        <circle cx="60" cy="90" r="35" fill="#FFDBAC" stroke="#2C3E50" strokeWidth="2" />

        {/* Eyes */}
        <circle cx="50" cy="85" r="4" fill="#2C3E50" />
        <circle cx="70" cy="85" r="4" fill="#2C3E50" />

        {/* Nose */}
        <ellipse cx="60" cy="95" rx="3" ry="4" fill="#FF8C69" />

        {/* Beard */}
        <path
          d="M35 110 Q35 130 60 140 Q85 130 85 110 L85 95 Q85 90 80 85 L40 85 Q35 90 35 95 Z"
          fill={colorSet.beard}
          stroke="#2C3E50"
          strokeWidth="2"
        />

        {/* Body */}
        <rect x="35" y="120" width="50" height="40" rx="25" fill={colorSet.body} stroke="#2C3E50" strokeWidth="2" />

        {/* Arms */}
        <ellipse cx="25" cy="125" rx="8" ry="15" fill={colorSet.body} stroke="#2C3E50" strokeWidth="2" />
        <ellipse cx="95" cy="125" rx="8" ry="15" fill={colorSet.body} stroke="#2C3E50" strokeWidth="2" />

        {/* Belt */}
        <rect x="35" y="140" width="50" height="8" fill="#2C3E50" />

        {/* Legs */}
        <rect x="40" y="155" width="12" height="5" rx="2" fill="#2C3E50" />
        <rect x="68" y="155" width="12" height="5" rx="2" fill="#2C3E50" />
      </svg>
    </button>
  )
}
