'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronDown, ChevronUp, Camera } from 'lucide-react'
import type { Pose } from '@/types'
import { DIFFICULTY_COLORS } from '@/types'
import { cn } from '@/lib/utils'
import PoseSilhouette from './PoseSilhouette'

const PoseCamera = dynamic(() => import('./PoseCamera'), { ssr: false })

interface PoseCardProps {
  pose: Pose
  index: number
}

const CATEGORY_ICONS: Record<string, string> = {
  casual: '😎',
  formal: '👔',
  romantic: '❤️',
  fun: '🎉',
  editorial: '📸',
  traditional: '🙏',
  candid: '🤣',
  action: '⚡',
}

export default function PoseCard({ pose, index }: PoseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const difficultyClass = DIFFICULTY_COLORS[pose.difficulty] || DIFFICULTY_COLORS.Easy

  return (
    <>
      {showCamera && (
        <PoseCamera pose={pose} onClose={() => setShowCamera(false)} />
      )}

      <div
        className={cn(
          'glass-card rounded-2xl overflow-hidden card-hover border border-white/5',
          'animate-in fade-in slide-in-from-bottom-4 duration-500'
        )}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Silhouette Thumbnail — Click to open camera */}
        <div
          className="relative h-36 bg-gradient-to-b from-purple-950/40 to-zinc-900/60 flex items-center justify-center cursor-pointer group overflow-hidden"
          onClick={() => setShowCamera(true)}
        >
          <PoseSilhouette pose={pose} size="small" animated />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/20 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-xs font-bold bg-black/40 px-3 py-1 rounded-full">
                Try This Pose!
              </p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 pb-4">
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{pose.emoji || CATEGORY_ICONS[pose.category] || '📸'}</span>
              <span className="text-xs text-zinc-600 uppercase tracking-wider">
                {CATEGORY_ICONS[pose.category]} {pose.category}
              </span>
            </div>
            <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', difficultyClass)}>
              {pose.difficulty}
            </span>
          </div>

          <h3 className="text-lg font-black text-white leading-tight mb-2">{pose.name}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{pose.description}</p>

          {pose.tags && pose.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {pose.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-white/5 text-zinc-500 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-white/5" />

        {/* Instructions */}
        <div className="p-5 pt-4">
          <div className="space-y-2">
            {(expanded ? pose.instructions : pose.instructions.slice(0, 2)).map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-zinc-300 leading-snug">{step}</p>
              </div>
            ))}
            {!expanded && pose.instructions.length > 2 && (
              <p className="text-xs text-zinc-600 ml-7">+{pose.instructions.length - 2} more steps...</p>
            )}
          </div>

          {/* Pro Tips when expanded */}
          {expanded && pose.tips && pose.tips.length > 0 && (
            <div className="mt-4 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
              <p className="text-xs font-bold text-amber-400 mb-2">💡 Pro Tips</p>
              <div className="space-y-1.5">
                {pose.tips.map((tip, i) => (
                  <p key={i} className="text-xs text-zinc-400 leading-snug">• {tip}</p>
                ))}
              </div>
            </div>
          )}

          {/* Expand / Collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" /> Show Less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" /> View Details & Tips</>
            )}
          </button>

          {/* Camera CTA Button */}
          <button
            onClick={() => setShowCamera(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 text-white py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
          >
            <Camera className="w-4 h-4" />
            Try This Pose
          </button>
        </div>
      </div>
    </>
  )
}
