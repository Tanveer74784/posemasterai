'use client'

import type { Pose } from '@/types'

interface PoseSilhouetteProps {
  pose: Pose
  size?: 'small' | 'large' | 'fullscreen'
  animated?: boolean
  overlay?: boolean
}

// SVG silhouettes for different group sizes and pose categories
function getSilhouetteSVG(pose: Pose, size: string, overlay: boolean): JSX.Element {
  const { groupSize, category, occasion } = pose
  const strokeColor = overlay ? 'rgba(168, 85, 247, 0.9)' : '#a855f7'
  const fillColor = overlay ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.2)'
  const dashArray = overlay ? '8 4' : 'none'

  const dims = size === 'fullscreen' ? { w: 320, h: 480 } : size === 'large' ? { w: 240, h: 360 } : { w: 120, h: 180 }

  // Single person poses
  if (groupSize === 1) {
    return <SinglePersonSVG category={category} dims={dims} stroke={strokeColor} fill={fillColor} dash={dashArray} animated={!overlay} />
  }
  // Couple / 2 people
  if (groupSize === 2) {
    return <TwoPersonSVG occasion={occasion} dims={dims} stroke={strokeColor} fill={fillColor} dash={dashArray} animated={!overlay} />
  }
  // 3 people
  if (groupSize === 3) {
    return <ThreePersonSVG dims={dims} stroke={strokeColor} fill={fillColor} dash={dashArray} animated={!overlay} />
  }
  // 4-5 people
  if (groupSize <= 5) {
    return <GroupSVG count={groupSize} dims={dims} stroke={strokeColor} fill={fillColor} dash={dashArray} animated={!overlay} />
  }
  // Large group
  return <LargeGroupSVG dims={dims} stroke={strokeColor} fill={fillColor} dash={dashArray} />
}

function SinglePersonSVG({ category, dims, stroke, fill, dash, animated }: any) {
  const isAction = category === 'action'
  const isEditorial = category === 'editorial'
  const isRomantic = category === 'romantic' || category === 'fun'

  return (
    <svg width={dims.w} height={dims.h} viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="18" r="12" stroke={stroke} strokeWidth="2.5" fill={fill} strokeDasharray={dash} />
      {/* Body */}
      <line x1="50" y1="30" x2="50" y2="85" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Left arm */}
      <line x1="50" y1="45"
        x2={isAction ? "22" : isEditorial ? "25" : "28"}
        y2={isAction ? "35" : isEditorial ? "65" : "70"}
        stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Right arm */}
      <line x1="50" y1="45"
        x2={isAction ? "78" : isEditorial ? "75" : "72"}
        y2={isAction ? "30" : isEditorial ? "60" : "70"}
        stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="50" y1="85"
        x2={isAction ? "32" : "38"}
        y2={isAction ? "125" : "140"}
        stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="50" y1="85"
        x2={isAction ? "70" : "62"}
        y2={isAction ? "125" : "140"}
        stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Category label */}
      <text x="50" y="155" textAnchor="middle" fontSize="7" fill={stroke} fontFamily="sans-serif">
        {isAction ? '⚡ Power' : isEditorial ? '📸 Editorial' : '😎 Casual'}
      </text>
    </svg>
  )
}

function TwoPersonSVG({ occasion, dims, stroke, fill, dash, animated }: any) {
  const isRomantic = occasion === 'romantic' || occasion === 'wedding'
  const gap = isRomantic ? 28 : 35

  const renderPerson = (cx: number, mirrorArm?: boolean) => (
    <g key={cx}>
      <circle cx={cx} cy="18" r="10" stroke={stroke} strokeWidth="2.5" fill={fill} strokeDasharray={dash} />
      <line x1={cx} y1="28" x2={cx} y2="80" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Inner arm (toward each other) */}
      <line x1={cx} y1="42" x2={mirrorArm ? cx + 14 : cx - 14} y2={isRomantic ? "55" : "65"} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Outer arm */}
      <line x1={cx} y1="42" x2={mirrorArm ? cx - 18 : cx + 18} y2="65" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx} y1="80" x2={cx - 8} y2="130" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <line x1={cx} y1="80" x2={cx + 8} y2="130" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )

  return (
    <svg width={dims.w} height={dims.h} viewBox="0 0 100 155" fill="none" xmlns="http://www.w3.org/2000/svg">
      {renderPerson(35, false)}
      {renderPerson(65, true)}
      {isRomantic && (
        <>
          {/* Heart between them */}
          <text x="50" y="52" textAnchor="middle" fontSize="10">❤️</text>
        </>
      )}
      <text x="50" y="150" textAnchor="middle" fontSize="7" fill={stroke} fontFamily="sans-serif">
        {isRomantic ? '❤️ Romantic' : '👫 Together'}
      </text>
    </svg>
  )
}

function ThreePersonSVG({ dims, stroke, fill, dash, animated }: any) {
  const positions = [25, 50, 75]

  return (
    <svg width={dims.w} height={dims.h} viewBox="0 0 100 155" fill="none" xmlns="http://www.w3.org/2000/svg">
      {positions.map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy={i === 1 ? "15" : "20"} r="9" stroke={stroke} strokeWidth="2" fill={fill} strokeDasharray={dash} />
          <line x1={cx} y1={i === 1 ? "24" : "29"} x2={cx} y2={i === 1 ? "75" : "80"} stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1={cx} y1={i === 1 ? "38" : "42"} x2={cx - 12} y2="65" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1={cx} y1={i === 1 ? "38" : "42"} x2={cx + 12} y2="65" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1={cx} y1={i === 1 ? "75" : "80"} x2={cx - 7} y2="128" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1={cx} y1={i === 1 ? "75" : "80"} x2={cx + 7} y2="128" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <text x="50" y="148" textAnchor="middle" fontSize="7" fill={stroke} fontFamily="sans-serif">
        👥 Trio
      </text>
    </svg>
  )
}

function GroupSVG({ count, dims, stroke, fill, dash, animated }: any) {
  const positions = count === 4
    ? [20, 40, 62, 82]
    : [14, 30, 50, 70, 86]

  return (
    <svg width={dims.w} height={dims.h} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {positions.map((cx, i) => {
        const isMid = i === Math.floor(positions.length / 2)
        const cy = isMid ? 14 : 18
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="7" stroke={stroke} strokeWidth="1.8" fill={fill} strokeDasharray={dash} />
            <line x1={cx} y1={cy + 7} x2={cx} y2={cy + 52} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <line x1={cx} y1={cy + 18} x2={cx - 9} y2={cy + 38} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <line x1={cx} y1={cy + 18} x2={cx + 9} y2={cy + 38} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <line x1={cx} y1={cy + 52} x2={cx - 5} y2={cy + 88} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
            <line x1={cx} y1={cy + 52} x2={cx + 5} y2={cy + 88} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )
      })}
      <text x="50" y="148" textAnchor="middle" fontSize="7" fill={stroke} fontFamily="sans-serif">
        🫂 Group of {count}
      </text>
    </svg>
  )
}

function LargeGroupSVG({ dims, stroke, fill, dash }: any) {
  const row1 = [15, 30, 50, 70, 85]
  const row2 = [22, 42, 62, 78]

  return (
    <svg width={dims.w} height={dims.h} viewBox="0 0 100 155" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back row */}
      {row1.map((cx, i) => (
        <g key={`r1-${i}`} opacity="0.7">
          <circle cx={cx} cy="16" r="6" stroke={stroke} strokeWidth="1.5" fill={fill} strokeDasharray={dash} />
          <line x1={cx} y1="22" x2={cx} y2="55" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx} y1="32" x2={cx - 8} y2="48" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx} y1="32" x2={cx + 8} y2="48" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx} y1="55" x2={cx - 5} y2="78" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={cx} y1="55" x2={cx + 5} y2="78" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
      {/* Front row */}
      {row2.map((cx, i) => (
        <g key={`r2-${i}`}>
          <circle cx={cx} cy="68" r="7" stroke={stroke} strokeWidth="1.8" fill={fill} strokeDasharray={dash} />
          <line x1={cx} y1="75" x2={cx} y2="112" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <line x1={cx} y1="85" x2={cx - 9} y2="100" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <line x1={cx} y1="85" x2={cx + 9} y2="100" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <line x1={cx} y1="112" x2={cx - 6} y2="138" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <line x1={cx} y1="112" x2={cx + 6} y2="138" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}
      <text x="50" y="152" textAnchor="middle" fontSize="7" fill={stroke} fontFamily="sans-serif">
        🎊 Large Group
      </text>
    </svg>
  )
}

export default function PoseSilhouette({ pose, size = 'large', animated = false, overlay = false }: PoseSilhouetteProps) {
  const bgClass = overlay ? '' : 'bg-gradient-to-b from-purple-950/50 to-zinc-900/50 rounded-2xl'

  return (
    <div className={`flex items-center justify-center ${bgClass} ${animated ? 'animate-float' : ''}`}>
      {getSilhouetteSVG(pose, size, overlay)}
    </div>
  )
}
