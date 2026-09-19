'use client'

import { cn } from '@/lib/utils'
import type { Occasion } from '@/types'
import { OCCASIONS } from '@/types'

interface OccasionPickerProps {
  selected: Occasion
  onChange: (occasion: Occasion) => void
}

export default function OccasionPicker({ selected, onChange }: OccasionPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {OCCASIONS.map((occ) => (
        <button
          key={occ.value}
          onClick={() => onChange(occ.value)}
          className={cn(
            'flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl border transition-all duration-200 text-sm',
            selected === occ.value
              ? 'bg-pink-600/20 border-pink-500 text-white scale-105 shadow-lg shadow-pink-500/10'
              : 'glass-card border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
          )}
        >
          <span className="text-2xl">{occ.emoji}</span>
          <span className="font-bold text-xs">{occ.label}</span>
          <span className="text-xs text-zinc-600 text-center leading-tight hidden sm:block">{occ.description}</span>
        </button>
      ))}
    </div>
  )
}
