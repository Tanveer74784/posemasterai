'use client'

const loadingPhrases = [
  '🤖 AI soch raha hai...',
  '📸 Perfect poses dhundh raha hai...',
  '✨ Creativity ke saath kaam ho raha hai...',
  '🎭 Har pose carefully ban raha hai...',
  '💡 Pro tips bhi aa rahe hain...',
]

export default function LoadingPoses() {
  return (
    <div className="py-16">
      {/* Main loading animation */}
      <div className="flex flex-col items-center justify-center gap-6 mb-12">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            📸
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white mb-1">Poses Generate Ho Rahe Hain...</p>
          <p className="text-zinc-500">Gemini AI kaam par hai, thoda ruko! ⏳</p>
        </div>
      </div>

      {/* Skeleton cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-5 border border-white/5"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Top row skeleton */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl shimmer-bg bg-white/5" />
                <div className="w-20 h-3 rounded-full shimmer-bg bg-white/5" />
              </div>
              <div className="w-14 h-5 rounded-full shimmer-bg bg-white/5" />
            </div>

            {/* Title skeleton */}
            <div className="w-3/4 h-5 rounded-full shimmer-bg bg-white/5 mb-2" />
            <div className="w-full h-3 rounded-full shimmer-bg bg-white/5 mb-1" />
            <div className="w-2/3 h-3 rounded-full shimmer-bg bg-white/5 mb-4" />

            {/* Tags skeleton */}
            <div className="flex gap-2 mb-4">
              <div className="w-16 h-4 rounded-full shimmer-bg bg-white/5" />
              <div className="w-20 h-4 rounded-full shimmer-bg bg-white/5" />
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full shrink-0 shimmer-bg bg-white/5" />
                <div className="flex-1 h-3 rounded-full shimmer-bg bg-white/5" />
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full shrink-0 shimmer-bg bg-white/5" />
                <div className="flex-1 h-3 rounded-full shimmer-bg bg-white/5 w-4/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
