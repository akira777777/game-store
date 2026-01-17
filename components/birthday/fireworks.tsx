"use client"

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react"

export interface FireworksHandle {
  launch: (x: number, y: number, count?: number) => void
  clear: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  life: number
  maxLife: number
  size: number
}

interface Firework {
  x: number
  y: number
  particles: Particle[]
}

const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6BCF7F", "#A8E6CF", "#95E1D3", "#F38181", "#FFA07A", "#C7CEEA"]

export const Fireworks = forwardRef<FireworksHandle, { className?: string }>(
  ({ className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number>()
    const fireworksRef = useRef<Firework[]>([])

    useImperativeHandle(ref, () => ({
      launch: (x: number, y: number, count: number = 50) => {
        const particles: Particle[] = []
        const color = colors[Math.floor(Math.random() * colors.length)]

        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
          const speed = 2 + Math.random() * 4
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            maxLife: 60 + Math.random() * 40,
            size: 2 + Math.random() * 3,
          })
        }

        fireworksRef.current.push({ x, y, particles })
      },
      clear: () => {
        fireworksRef.current = []
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
          }
        }
      },
    }))

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const resize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      resize()
      window.addEventListener("resize", resize)

      const animate = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        fireworksRef.current = fireworksRef.current.filter((firework) => {
          let hasActiveParticles = false

          firework.particles.forEach((particle) => {
            if (particle.life > 0) {
              hasActiveParticles = true

              // Update position
              particle.x += particle.vx
              particle.y += particle.vy

              // Apply gravity
              particle.vy += 0.1

              // Friction
              particle.vx *= 0.98
              particle.vy *= 0.98

              // Update life
              particle.life -= 1 / particle.maxLife

              // Draw particle
              const alpha = particle.life
              ctx.globalAlpha = alpha
              ctx.fillStyle = particle.color
              ctx.beginPath()
              ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
              ctx.fill()

              // Add glow effect
              ctx.shadowBlur = 10
              ctx.shadowColor = particle.color
              ctx.fill()
              ctx.shadowBlur = 0
            }
          })

          ctx.globalAlpha = 1
          return hasActiveParticles
        })

        animationFrameRef.current = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        window.removeEventListener("resize", resize)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [])

    return (
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-10 ${className || ""}`}
      />
    )
  }
)

Fireworks.displayName = "Fireworks"
