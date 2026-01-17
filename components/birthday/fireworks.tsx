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
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
          const speed = 2.5 + Math.random() * 5
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
            maxLife: 80 + Math.random() * 60,
            size: 2.5 + Math.random() * 4,
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
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
      }

      resize()
      
      let resizeTimeout: NodeJS.Timeout
      const handleResize = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(resize, 250)
      }
      
      window.addEventListener("resize", handleResize)

      const animate = () => {
        // Clear with fade effect for trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
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

              // Draw particle with glow effect
              const alpha = particle.life
              
              // Outer glow
              ctx.save()
              ctx.globalAlpha = alpha * 0.3
              ctx.shadowBlur = 20
              ctx.shadowColor = particle.color
              ctx.fillStyle = particle.color
              ctx.beginPath()
              ctx.arc(particle.x, particle.y, particle.size * alpha * 2, 0, Math.PI * 2)
              ctx.fill()
              ctx.restore()

              // Main particle
              ctx.save()
              ctx.globalAlpha = alpha
              ctx.fillStyle = particle.color
              ctx.beginPath()
              ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2)
              ctx.fill()
              
              // Inner bright core
              ctx.globalAlpha = alpha * 0.8
              ctx.fillStyle = "white"
              ctx.beginPath()
              ctx.arc(particle.x, particle.y, particle.size * alpha * 0.3, 0, Math.PI * 2)
              ctx.fill()
              ctx.restore()
            }
          })

          ctx.globalAlpha = 1
          return hasActiveParticles
        })

        animationFrameRef.current = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        window.removeEventListener("resize", handleResize)
        if (resizeTimeout) {
          clearTimeout(resizeTimeout)
        }
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
