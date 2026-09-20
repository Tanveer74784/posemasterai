'use client'

import type { Pose } from '@/types'

interface PoseSilhouetteProps {
  pose: Pose
  size?: 'small' | 'large' | 'fullscreen'
  animated?: boolean
  overlay?: boolean
}

interface Point {
  x: number
  y: number
  label?: string
}

interface Skeleton {
  head: Point
  shoulders: [Point, Point]
  elbows: [Point, Point]
  wrists: [Point, Point]
  hips: [Point, Point]
  knees: [Point, Point]
  ankles: [Point, Point]
}

function renderDotSkeleton(
  sk: Skeleton, 
  strokeColor: string, 
  dotColor: string, 
  glowColor: string, 
  dash: string, 
  keyPrefix = 'sk'
) {
  const [ls, rs] = sk.shoulders
  const [le, re] = sk.elbows
  const [lw, rw] = sk.wrists
  const [lh, rh] = sk.hips
  const [lk, rk] = sk.knees
  const [la, ra] = sk.ankles

  const midShoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 }
  const midHip = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 }

  const dots = [
    sk.head,
    ls, rs,
    le, re,
    lw, rw,
    lh, rh,
    lk, rk,
    la, ra
  ]

  const lines = [
    // Neck/Spine
    [sk.head, midShoulder],
    [midShoulder, midHip],
    // Shoulder bar & Hip bar
    [ls, rs],
    [lh, rh],
    // Arms
    [ls, le],
    [le, lw],
    [rs, re],
    [re, rw],
    // Legs
    [lh, lk],
    [lk, la],
    [rh, rk],
    [rk, ra]
  ]

  return (
    <g key={keyPrefix}>
      {/* Bones / Connecting Guide Lines */}
      {lines.map(([p1, p2], idx) => (
        <line
          key={`${keyPrefix}-line-${idx}`}
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeDasharray={dash}
          strokeLinecap="round"
        />
      ))}

      {/* Head Ring Guide */}
      <circle
        cx={sk.head.x}
        cy={sk.head.y}
        r="10"
        stroke={strokeColor}
        strokeWidth="2"
        strokeDasharray={dash}
        fill="rgba(168, 85, 247, 0.12)"
      />

      {/* Keypoint Joints / Dots */}
      {dots.map((d, idx) => (
        <g key={`${keyPrefix}-dot-${idx}`}>
          {/* Subtle joint glow */}
          <circle
            cx={d.x}
            cy={d.y}
            r="4.5"
            fill={glowColor}
            opacity="0.6"
          />
          {/* Main Keypoint Dot */}
          <circle
            cx={d.x}
            cy={d.y}
            r="2.8"
            fill={dotColor}
            stroke="#ffffff"
            strokeWidth="1"
          />
        </g>
      ))}
    </g>
  )
}

export default function PoseSilhouette({
  pose,
  size = 'large',
  animated = false,
  overlay = false
}: PoseSilhouetteProps) {
  const { groupSize, category } = pose

  // Neon glowing futuristic colors for high contrast guide
  const strokeColor = overlay ? '#38bdf8' : '#c084fc' // Cyan on camera overlay for contrast, purple in card
  const dotColor = overlay ? '#22d3ee' : '#e879f9'
  const glowColor = overlay ? '#0284c7' : '#a855f7'
  const dash = overlay ? '5 4' : '4 3'

  const dims = size === 'fullscreen' 
    ? { w: 320, h: 480 } 
    : size === 'large' 
    ? { w: 240, h: 360 } 
    : { w: 140, h: 190 }

  const renderContent = () => {
    // 1 Person Solo Skeletons based on Category
    if (groupSize === 1) {
      const isAction = category === 'action'
      const isEditorial = category === 'editorial'

      const sk1: Skeleton = isAction
        ? {
            head: { x: 50, y: 22 },
            shoulders: [{ x: 34, y: 44 }, { x: 66, y: 42 }],
            elbows: [{ x: 20, y: 32 }, { x: 80, y: 28 }],
            wrists: [{ x: 14, y: 18 }, { x: 88, y: 16 }],
            hips: [{ x: 40, y: 88 }, { x: 60, y: 88 }],
            knees: [{ x: 30, y: 122 }, { x: 72, y: 124 }],
            ankles: [{ x: 24, y: 154 }, { x: 78, y: 154 }]
          }
        : isEditorial
        ? {
            head: { x: 48, y: 22 },
            shoulders: [{ x: 35, y: 45 }, { x: 65, y: 44 }],
            elbows: [{ x: 26, y: 64 }, { x: 74, y: 55 }],
            wrists: [{ x: 36, y: 84 }, { x: 68, y: 40 }], // Hand on hip, other near hair
            hips: [{ x: 40, y: 90 }, { x: 60, y: 88 }],
            knees: [{ x: 44, y: 126 }, { x: 62, y: 124 }],
            ankles: [{ x: 46, y: 156 }, { x: 64, y: 155 }]
          }
        : {
            // Casual relaxed stand
            head: { x: 50, y: 22 },
            shoulders: [{ x: 36, y: 45 }, { x: 64, y: 45 }],
            elbows: [{ x: 28, y: 68 }, { x: 72, y: 68 }],
            wrists: [{ x: 35, y: 86 }, { x: 65, y: 86 }], // hands casually at sides/pockets
            hips: [{ x: 42, y: 90 }, { x: 58, y: 90 }],
            knees: [{ x: 40, y: 126 }, { x: 60, y: 126 }],
            ankles: [{ x: 38, y: 156 }, { x: 62, y: 156 }]
          }

      return (
        <svg width={dims.w} height={dims.h} viewBox="0 0 100 170" fill="none">
          {renderDotSkeleton(sk1, strokeColor, dotColor, glowColor, dash, 'p1')}
          <text x="50" y="167" textAnchor="middle" fontSize="6.5" fill={strokeColor} fontWeight="600" letterSpacing="0.8">
            SOLO POSE GUIDE
          </text>
        </svg>
      )
    }

    // 2 People (Couple / Duo)
    if (groupSize === 2) {
      const skA: Skeleton = {
        head: { x: 35, y: 26 },
        shoulders: [{ x: 22, y: 48 }, { x: 46, y: 48 }],
        elbows: [{ x: 15, y: 70 }, { x: 48, y: 65 }],
        wrists: [{ x: 20, y: 88 }, { x: 50, y: 75 }], // Arm wrapping
        hips: [{ x: 28, y: 92 }, { x: 42, y: 92 }],
        knees: [{ x: 27, y: 126 }, { x: 43, y: 126 }],
        ankles: [{ x: 26, y: 156 }, { x: 44, y: 156 }]
      }

      const skB: Skeleton = {
        head: { x: 65, y: 24 },
        shoulders: [{ x: 54, y: 47 }, { x: 78, y: 47 }],
        elbows: [{ x: 52, y: 66 }, { x: 85, y: 69 }],
        wrists: [{ x: 50, y: 75 }, { x: 80, y: 88 }],
        hips: [{ x: 58, y: 92 }, { x: 72, y: 92 }],
        knees: [{ x: 57, y: 126 }, { x: 73, y: 126 }],
        ankles: [{ x: 56, y: 156 }, { x: 74, y: 156 }]
      }

      return (
        <svg width={dims.w} height={dims.h} viewBox="0 0 100 170" fill="none">
          {renderDotSkeleton(skA, strokeColor, dotColor, glowColor, dash, 'pA')}
          {renderDotSkeleton(skB, strokeColor, dotColor, glowColor, dash, 'pB')}
          <text x="50" y="167" textAnchor="middle" fontSize="6.5" fill={strokeColor} fontWeight="600" letterSpacing="0.8">
            DUO / PAIR GUIDE
          </text>
        </svg>
      )
    }

    // 3 People (Trio)
    if (groupSize === 3) {
      const positions = [25, 50, 75]
      return (
        <svg width={dims.w} height={dims.h} viewBox="0 0 100 170" fill="none">
          {positions.map((cx, i) => {
            const isCenter = i === 1
            const sk: Skeleton = {
              head: { x: cx, y: isCenter ? 20 : 25 },
              shoulders: [{ x: cx - 9, y: isCenter ? 40 : 45 }, { x: cx + 9, y: isCenter ? 40 : 45 }],
              elbows: [{ x: cx - 13, y: 62 }, { x: cx + 13, y: 62 }],
              wrists: [{ x: cx - 8, y: 80 }, { x: cx + 8, y: 80 }],
              hips: [{ x: cx - 6, y: 86 }, { x: cx + 6, y: 86 }],
              knees: [{ x: cx - 6, y: 122 }, { x: cx + 6, y: 122 }],
              ankles: [{ x: cx - 6, y: 154 }, { x: cx + 6, y: 154 }]
            }
            return renderDotSkeleton(sk, strokeColor, dotColor, glowColor, dash, `trio-${i}`)
          })}
          <text x="50" y="167" textAnchor="middle" fontSize="6.5" fill={strokeColor} fontWeight="600" letterSpacing="0.8">
            TRIO SKELETON GUIDE
          </text>
        </svg>
      )
    }

    // 4+ / Group Skeletons
    const count = Math.min(groupSize, 5)
    const step = 84 / (count + 1)
    return (
      <svg width={dims.w} height={dims.h} viewBox="0 0 100 170" fill="none">
        {Array.from({ length: count }).map((_, idx) => {
          const cx = 8 + step * (idx + 1)
          const sk: Skeleton = {
            head: { x: cx, y: 26 },
            shoulders: [{ x: cx - 6, y: 44 }, { x: cx + 6, y: 44 }],
            elbows: [{ x: cx - 9, y: 63 }, { x: cx + 9, y: 63 }],
            wrists: [{ x: cx - 6, y: 80 }, { x: cx + 6, y: 80 }],
            hips: [{ x: cx - 4, y: 87 }, { x: cx + 4, y: 87 }],
            knees: [{ x: cx - 4, y: 122 }, { x: cx + 4, y: 122 }],
            ankles: [{ x: cx - 4, y: 154 }, { x: cx + 4, y: 154 }]
          }
          return renderDotSkeleton(sk, strokeColor, dotColor, glowColor, dash, `grp-${idx}`)
        })}
        <text x="50" y="167" textAnchor="middle" fontSize="6.5" fill={strokeColor} fontWeight="600" letterSpacing="0.8">
          GROUP ({groupSize} PPL) GUIDE
        </text>
      </svg>
    )
  }

  const bgClass = overlay 
    ? 'pointer-events-none drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]' 
    : 'bg-zinc-950/70 border border-white/10 rounded-2xl p-2'

  return (
    <div className={`flex items-center justify-center ${bgClass} ${animated ? 'animate-float' : ''}`}>
      {renderContent()}
    </div>
  )
}
