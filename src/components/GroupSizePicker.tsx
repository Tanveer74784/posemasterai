'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GROUP_SIZES } from '@/types'
import { Minus, Plus } from 'lucide-react'

interface GroupSizePickerProps {
  selected: number
  onChange: (size: number) => void
}

export default function GroupSizePicker({ selected, onChange }: GroupSizePickerProps) {
  const [customMode, setCustomMode] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const handlePreset = (value: number) => {
    setCustomMode(false)
    onChange(value)
  }

  const handleCustomChange = (val: string) => {
    setCustomValue(val)
    const num = parseInt(val)
    if (!isNaN(num) && num >= 1 && num <= 50) {
      onChange(num)
    }
  }

  return (
    <div>
      {/* Preset sizes */}
      <div className="flex flex-wrap gap-3 mb-4">
        {GROUP_SIZES.map((g) => (
          <button
            key={g.value}
            onClick={() => handlePreset(g.value)}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border transition-all duration-200 font-medium text-sm',
              selected === g.value && !customMode
                ? 'bg-purple-600/30 border-purple-500 text-white scale-105 glow-purple'
                : 'glass-card border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            )}
          >
            <span className="text-2xl">{g.emoji}</span>
            <span className="font-bold">{g.label}</span>
            <span className="text-xs text-zinc-600">{g.description}</span>
          </button>
        ))}

        {/* Custom button */}
        <button
          onClick={() => setCustomMode(true)}
          className={cn(
            'flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border transition-all duration-200 font-medium text-sm',
            customMode
              ? 'bg-purple-600/30 border-purple-500 text-white scale-105'
              : 'glass-card border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
          )}
        >
          <span className="text-2xl">🔢</span>
          <span className="font-bold">Custom</span>
          <span className="text-xs text-zinc-600">Any number</span>
        </button>
      </div>

      {/* Custom number input */}
      {customMode && (
        <div className="flex items-center gap-3 glass-card rounded-xl p-4 max-w-xs">
          <button
            onClick={() => handleCustomChange(String(Math.max(1, selected - 1)))}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center">
            <input
              type="number"
              min={1}
              max={50}
              value={customValue || selected}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-full text-center text-2xl font-black text-white bg-transparent outline-none"
            />
            <p className="text-xs text-zinc-500">people (1-50)</p>
          </div>
          <button
            onClick={() => handleCustomChange(String(Math.min(50, selected + 1)))}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selected display */}
      {selected > 0 && (
        <div className="mt-3 text-sm text-zinc-500">
          ✅ Selected: <span className="text-purple-400 font-bold">{selected} person{selected > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}
