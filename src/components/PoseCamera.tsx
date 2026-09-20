'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { X, Camera, RotateCcw, Download, CheckCircle, FlipHorizontal, Eye, EyeOff } from 'lucide-react'
import type { Pose } from '@/types'
import PoseSilhouette from './PoseSilhouette'

interface PoseCameraProps {
  pose: Pose
  onClose: () => void
}

export default function PoseCamera({ pose, onClose }: PoseCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [phase, setPhase] = useState<'preview' | 'camera' | 'captured'>('preview')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showGuide, setShowGuide] = useState(true)
  const [guideOpacity, setGuideOpacity] = useState(0.75)

  const startCamera = useCallback(async (mode: 'user' | 'environment' = facingMode) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true')
        videoRef.current.play().catch(e => console.log('Video play error:', e))
      }
      setCameraError(null)
      setPhase('camera')
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser.')
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.')
      } else {
        setCameraError('Unable to start camera stream. Please try again.')
      }
    }
  }, [facingMode])

  const flipCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newMode)
    await startCamera(newMode)
  }

  const startCountdown = () => {
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          capturePhoto()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = canvas.toDataURL('image/jpeg', 0.95)
    setCapturedImage(imageData)
    setPhase('captured')

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [facingMode])

  const retake = () => {
    setCapturedImage(null)
    setCountdown(null)
    startCamera(facingMode)
  }

  const downloadPhoto = () => {
    if (!capturedImage) return
    const a = document.createElement('a')
    a.href = capturedImage
    a.download = `posemaster-${pose.name.replace(/\s+/g, '-').toLowerCase()}.jpg`
    a.click()
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/80 backdrop-blur-md z-10 border-b border-white/10">
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        <div className="text-center">
          <p className="text-white font-bold text-sm tracking-wide">{pose.emoji} {pose.name}</p>
          <p className="text-purple-400 text-xs font-medium uppercase tracking-wider">{pose.difficulty} • {pose.category}</p>
        </div>

        {phase === 'camera' ? (
          <button 
            onClick={() => setShowGuide(!showGuide)} 
            className="flex items-center gap-1.5 text-xs text-white px-3 py-1.5 rounded-full bg-purple-600/60 hover:bg-purple-600 border border-purple-400/30 transition-all"
          >
            {showGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showGuide ? 'Hide Dots' : 'Show Dots'}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* PHASE 1: PREVIEW */}
      {phase === 'preview' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 overflow-y-auto bg-zinc-950">
          {/* Dot Skeleton Preview Card */}
          <div className="relative w-full max-w-xs aspect-[3/4] bg-zinc-900/90 rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl flex flex-col items-center justify-center p-4">
            <div className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2">AI Skeleton Target</div>
            <PoseSilhouette pose={pose} size="large" animated />
            <div className="mt-3 text-center">
              <p className="text-white font-bold text-base">{pose.name}</p>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{pose.description}</p>
            </div>
          </div>

          {/* Key Step Directions */}
          <div className="w-full max-w-xs space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Step-by-Step Instructions:</p>
            {pose.instructions.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          {/* Start Camera Button */}
          {cameraError ? (
            <div className="w-full max-w-xs p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
              <p className="text-red-400 text-xs mb-3">{cameraError}</p>
              <button onClick={() => startCamera()} className="text-red-300 underline text-xs font-medium">Try Again</button>
            </div>
          ) : (
            <button
              onClick={() => startCamera()}
              className="w-full max-w-xs flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:opacity-95 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
            >
              <Camera className="w-5 h-5" />
              Open Live Camera Guide
            </button>
          )}
        </div>
      )}

      {/* PHASE 2: CAMERA WITH DOT SKELETON OVERLAY */}
      {phase === 'camera' && (
        <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            playsInline
            muted
            autoPlay
            onLoadedMetadata={() => videoRef.current?.play()}
          />

          {/* Viewfinder Target Frame */}
          <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-3xl">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl" />
          </div>

          {/* High Contrast Dot Skeleton Overlay */}
          {showGuide && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
              style={{ opacity: guideOpacity }}
            >
              <PoseSilhouette pose={pose} size="fullscreen" overlay />
            </div>
          )}

          {/* Top Instruction Banner */}
          {showGuide && (
            <div className="absolute top-4 left-4 right-4 text-center pointer-events-none">
              <div className="inline-block bg-zinc-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-400/40">
                <p className="text-white text-xs font-semibold">
                  Match body with the <span className="text-cyan-400 font-bold">Dot Joints</span>
                </p>
              </div>
            </div>
          )}

          {/* 3s Countdown Animation */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
              <div className="text-cyan-400 font-black text-9xl animate-ping">
                {countdown}
              </div>
            </div>
          )}

          {/* Bottom Camera Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              {/* Flip Front/Back */}
              <button
                onClick={flipCamera}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 text-white transition-all"
                title="Switch Camera"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>

              {/* Shutter: 3-Second Timer Capture */}
              <button
                onClick={startCountdown}
                disabled={countdown !== null}
                className="w-20 h-20 rounded-full bg-white border-4 border-cyan-400 hover:bg-cyan-50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-xl shadow-cyan-500/20"
                title="Capture with 3s Timer"
              >
                <div className="w-14 h-14 rounded-full bg-white border border-zinc-200" />
              </button>

              {/* Instant Shutter */}
              <button
                onClick={capturePhoto}
                disabled={countdown !== null}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 text-white transition-all"
                title="Instant Photo"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-center text-zinc-300 text-[11px] mt-3 font-medium tracking-wide">
              Tap center circle for 3s timer • Camera icon for instant snap
            </p>
          </div>
        </div>
      )}

      {/* PHASE 3: CAPTURED RESULT */}
      {phase === 'captured' && capturedImage && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 bg-zinc-950">
          <div className="relative w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden border-2 border-cyan-500 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capturedImage} alt="Captured pose" className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-1.5 shadow-md">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            
            {/* Watermark badge */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-white font-bold text-xs">{pose.emoji} {pose.name}</p>
              <p className="text-zinc-400 text-[10px]">PoseMaster AI</p>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-2.5">
            <button
              onClick={downloadPhoto}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
            >
              <Download className="w-4 h-4" />
              Save Photo to Device
            </button>
            
            <button
              onClick={retake}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3.5 rounded-2xl font-semibold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Pose
            </button>
          </div>
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
