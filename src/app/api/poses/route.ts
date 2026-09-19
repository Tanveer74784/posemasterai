import { NextRequest, NextResponse } from 'next/server'
import { generatePoses, generateQuickTips } from '@/lib/gemini'
import type { PoseRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: PoseRequest = await request.json()

    if (!body.groupSize || !body.occasion) {
      return NextResponse.json(
        { error: 'groupSize and occasion are required' },
        { status: 400 }
      )
    }

    if (body.groupSize < 1 || body.groupSize > 50) {
      return NextResponse.json(
        { error: 'groupSize must be between 1 and 50' },
        { status: 400 }
      )
    }

    const [poses, tips] = await Promise.all([
      generatePoses(body),
      generateQuickTips(body.groupSize, body.occasion),
    ])

    return NextResponse.json({ poses, tips })
  } catch (error: any) {
    console.error('Pose generation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to generate poses. Please try again.' },
      { status: 500 }
    )
  }
}
