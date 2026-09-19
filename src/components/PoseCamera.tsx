'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { X, Camera, RotateCcw, Download, CheckCircle, FlipHorizontal } from 'lucide-react'
import type { Pose } from '@/types'
import PoseSilhouette from './PoseSilhouette'

interface PoseCameraProps {
  pose: Pose
  onClose: () => void
}

export default function PoseCamera({ pose, onClose }: PoseCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [phase, setPhase] = useState<'preview' | 'camera' | 'captured'>('preview')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showGuide, setShowGuide] = useState(true)

  const startCamera = useCallback(async (mode: 'user' | 'environment' = facingMode) => {
    try {
      // Stop existing stream
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
        videoRef.current.play()
      }
      setCameraError(null)
      setPhase('camera')
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera permission in browser settings.')
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.')
      } else {
        setCameraError('Camera start nahi hua. Please try again.')
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
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedImage(imageData)
    setPhase('captured')

    // Stop camera
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  // Prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm z-10">
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{pose.emoji} {pose.name}</p>
          <p className="text-zinc-400 text-xs">{pose.difficulty}</p>
        </div>
        {phase === 'camera' && (
          <button onClick={() => setShowGuide(!showGuide)} className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded-lg bg-white/5">
            {showGuide ? 'Hide Guide' : 'Show Guide'}
          </button>
        )}
        {phase !== 'camera' && <div className="w-9" />}
      </div>

      {/* PHASE 1: PREVIEW */}
      {phase === 'preview' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 overflow-y-auto">
          {/* Pose silhouette preview */}
          <div className="relative w-full max-w-sm aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center">
            <PoseSilhouette pose={pose} size="large" animated />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white font-bold text-lg">{pose.name}</p>
              <p className="text-zinc-400 text-sm mt-1">{pose.description}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="w-full max-w-sm space-y-2">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Steps:</p>
            {pose.instructions.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-zinc-300 text-sm">{step}</p>
              </div>
            ))}
          </div>

          {/* CTA button */}
          {cameraError ? (
            <div className="w-full max-w-sm p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
              <p className="text-red-400 text-sm mb-3">⚠️ {cameraError}</p>
              <button onClick={() => startCamera()} className="text-red-300 underline text-sm">Try Again</button>
            </div>
          ) : (
            <button
              onClick={() => startCamera()}
              className="w-full max-w-sm flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105"
            >
              <Camera className="w-6 h-6" />
              Camera Kholo — Pose Try Karo!
            </button>
          )}
        </div>
      )}

      {/* PHASE 2: CAMERA */}
      {phase === 'camera' && (
        <div className="flex-1 relative overflow-hidden">
          {/* Camera Feed */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            playsInline
            muted
            autoPlay
          />

          {/* Pose Silhouette Overlay */}
          {showGuide && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="opacity-60">
                <PoseSilhouette pose={pose} size="fullscreen" overlay />
              </div>
            </div>
          )}

          {/* Guide text */}
          {showGuide && (
            <div className="absolute top-4 left-4 right-4 text-center pointer-events-none">
              <div className="inline-block bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-white text-sm font-medium">
                  ✨ Apne aap ko <span className="text-purple-300">silhouette</span> mein fit karo
                </p>
              </div>
            </div>
          )}

          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="text-white font-black text-9xl animate-ping-once">
                {countdown}
              </div>
            </div>
          )}

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              {/* Flip camera */}
              <button
                onClick={flipCamera}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <FlipHorizontal className="w-6 h-6 text-white" />
              </button>

              {/* Capture button */}
              <button
                onClick={startCountdown}
                disabled={countdown !== null}
                className="w-20 h-20 rounded-full bg-white border-4 border-purple-400 hover:bg-purple-100 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-white" />
              </button>

              {/* Timer option */}
              <button
                onClick={capturePhoto}
                disabled={countdown !== null}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            <p className="text-center text-zinc-400 text-xs mt-3">
              Big button = 3 sec timer • Camera icon = Instant
            </p>
          </div>
        </div>
      )}

      {/* PHASE 3: CAPTURED */}
      {phase === 'captured' && capturedImage && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border-4 border-purple-500 shadow-2xl shadow-purple-500/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capturedImage} alt="Captured pose" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-emerald-500 rounded-full p-2">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            {/* Pose name watermark */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-bold">{pose.emoji} {pose.name}</p>
              <p className="text-zinc-400 text-xs">PoseMaster AI</p>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={downloadPhoto}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all"
            >
              <Download className="w-5 h-5" />
              Photo Save Karo
            </button>
            <button
              onClick={retake}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Dobara Try Karo
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
