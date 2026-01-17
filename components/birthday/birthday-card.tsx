"use client"

interface BirthdayCardProps {
  isVisible: boolean
}

export function BirthdayCard({ isVisible }: BirthdayCardProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative animate-card-reveal">
        {/* Sparkles around card */}
        <div className="absolute -inset-8">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-sparkle"
              style={{
                left: `${50 + Math.cos((i * Math.PI * 2) / 16) * 300}px`,
                top: `${50 + Math.sin((i * Math.PI * 2) / 16) * 300}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + (i % 3) * 0.5}s`,
              }}
            >
              <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-2xl shadow-yellow-400/70" />
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-2xl md:rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 max-w-2xl mx-4 border-4 border-yellow-300 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 text-4xl animate-bounce">🎉</div>
          <div className="absolute top-4 right-4 text-4xl animate-bounce" style={{ animationDelay: "0.2s" }}>
            🎈
          </div>
          <div className="absolute bottom-4 left-4 text-4xl animate-bounce" style={{ animationDelay: "0.4s" }}>
            🎁
          </div>
          <div className="absolute bottom-4 right-4 text-4xl animate-bounce" style={{ animationDelay: "0.6s" }}>
            🎊
          </div>

          {/* Content */}
          <div className="text-center space-y-4 md:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-fade-in leading-tight">
              С Днем Рождения,
            </h1>
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-fade-in leading-tight" style={{ animationDelay: "0.2s" }}>
              Татьяна!
            </h2>
            <div className="pt-2 md:pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium">
                Пусть каждый день будет наполнен
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium mt-1 md:mt-2">
                радостью и счастьем! ✨
              </p>
            </div>
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-b-3xl" />
        </div>
      </div>
    </div>
  )
}
