'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, Sparkles, ArrowLeft, ChevronDown, Lightbulb, RefreshCw, Copy, Check, Filter } from 'lucide-react'
import type { Pose, Occasion } from '@/types'
import { OCCASIONS, GROUP_SIZES, DIFFICULTY_COLORS } from '@/types'
import PoseCard from '@/components/PoseCard'
import GroupSizePicker from '@/components/GroupSizePicker'
import OccasionPicker from '@/components/OccasionPicker'
import LoadingPoses from '@/components/LoadingPoses'

export default function PosesPage() {
  const [groupSize, setGroupSize] = useState<number>(1)
  const [occasion, setOccasion] = useState<Occasion>('casual')
  const [poses, setPoses] = useState<Pose[]>([])
  const [tips, setTips] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [copiedTip, setCopiedTip] = useState<number | null>(null)

  const generatePoses = async () => {
    setLoading(true)
    setError(null)
    setPoses([])
    setTips([])

    try {
      const res = await fetch('/api/poses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupSize, occasion }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setPoses(data.poses || [])
      setTips(data.tips || [])
      setHasGenerated(true)
    } catch (err: any) {
      setError(err.message || 'Poses generate karne mein dikkat aayi. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPoses = filterDifficulty === 'all'
    ? poses
    : poses.filter(p => p.difficulty === filterDifficulty)

  const copyTip = async (tip: string, index: number) => {
    await navigator.clipboard.writeText(tip)
    setCopiedTip(index)
    setTimeout(() => setCopiedTip(null), 2000)
  }

  const selectedOccasion = OCCASIONS.find(o => o.value === occasion)
  const selectedGroup = GROUP_SIZES.find(g => g.value === groupSize) || GROUP_SIZES[GROUP_SIZES.length - 1]

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:block">Back</span>
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-sm">Pose<span className="text-gradient">Master</span> AI</span>
            </div>
          </div>
          {hasGenerated && (
            <button
              onClick={generatePoses}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            🎯 Apna <span className="text-gradient">Perfect Pose</span> Chuno
          </h1>
          <p className="text-zinc-400">Group size aur occasion select karo — AI baaki sab karega!</p>
        </div>

        {/* Selectors */}
        <div className="space-y-6 mb-8">
          {/* Group Size */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              👥 Kitne log hain?
            </h2>
            <p className="text-zinc-500 text-sm mb-4">Group mein kitne log photo le rahe hain?</p>
            <GroupSizePicker selected={groupSize} onChange={setGroupSize} />
          </div>

          {/* Occasion */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              🎭 Kaunsa Occasion hai?
            </h2>
            <p className="text-zinc-500 text-sm mb-4">Photo kahan ki hai?</p>
            <OccasionPicker selected={occasion} onChange={setOccasion} />
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-10">
          <button
            onClick={generatePoses}
            disabled={loading}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-zinc-700 disabled:to-zinc-600 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed glow-purple disabled:shadow-none"
          >
            {loading ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                AI Poses Generate Kar Raha Hai...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                {hasGenerated ? 'Nayi Poses Generate Karo!' : 'Poses Generate Karo!'}
                <span className="text-white/70 text-base font-normal">
                  ({selectedGroup.emoji} {selectedGroup.label} + {selectedOccasion?.emoji} {selectedOccasion?.label})
                </span>
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="glass-card border border-red-500/30 rounded-2xl p-4 mb-8 text-center">
            <p className="text-red-400 mb-2">⚠️ {error}</p>
            <button onClick={generatePoses} className="text-sm text-red-300 hover:text-white underline">
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingPoses />}

        {/* Results */}
        {!loading && poses.length > 0 && (
          <div>
            {/* Tips Section */}
            {tips.length > 0 && (
              <div className="glass-card rounded-2xl p-6 mb-8 border border-amber-500/20">
                <h3 className="flex items-center gap-2 text-amber-400 font-bold text-lg mb-4">
                  <Lightbulb className="w-5 h-5" />
                  Pro Photography Tips
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 bg-amber-500/5 rounded-xl p-3 border border-amber-500/10 group">
                      <span className="text-amber-500 text-xs font-bold mt-0.5 shrink-0">{i + 1}.</span>
                      <p className="text-zinc-300 text-sm flex-1">{tip}</p>
                      <button
                        onClick={() => copyTip(tip, i)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        {copiedTip === i
                          ? <Check className="w-4 h-4 text-emerald-400" />
                          : <Copy className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header + Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-white">
                  ✨ {poses.length} Poses Generated
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  {selectedGroup.emoji} {selectedGroup.label} • {selectedOccasion?.emoji} {selectedOccasion?.label}
                </p>
              </div>
              {/* Difficulty Filter */}
              <div className="flex items-center gap-2 glass-card rounded-xl p-1">
                <Filter className="w-4 h-4 text-zinc-500 ml-2" />
                {['all', 'Easy', 'Medium', 'Pro'].map(d => (
                  <button
                    key={d}
                    onClick={() => setFilterDifficulty(d)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterDifficulty === d
                        ? 'bg-purple-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {d === 'all' ? 'All' : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Pose Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPoses.map((pose, index) => (
                <PoseCard key={pose.id || index} pose={pose} index={index} />
              ))}
            </div>

            {filteredPoses.length === 0 && (
              <div className="text-center py-12 text-zinc-500">
                <p>Is difficulty mein koi pose nahi mila. Filter change karo.</p>
              </div>
            )}

            {/* Regenerate CTA */}
            <div className="text-center mt-12">
              <button
                onClick={generatePoses}
                className="flex items-center gap-2 glass-card hover:border-purple-500/50 text-zinc-300 hover:text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-200 mx-auto"
              >
                <RefreshCw className="w-5 h-5" />
                Aur Nayi Poses Generate Karo
              </button>
            </div>
          </div>
        )}

        {/* Empty State (before first generation) */}
        {!loading && !hasGenerated && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-float">📸</div>
            <h3 className="text-2xl font-bold text-white mb-2">Taiyaar ho!</h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              Upar group size aur occasion select karo, phir "Poses Generate Karo" button dabao.
              AI ek second mein 9 unique poses suggest karega!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
