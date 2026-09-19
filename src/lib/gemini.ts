import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Pose, PoseRequest, PoseCategory } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generatePoses(request: PoseRequest): Promise<Pose[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

  const groupDescription = getGroupDescription(request.groupSize)

  const prompt = `You are PoseMaster AI, an expert photography pose director. Generate exactly 9 unique, creative and practical photo poses for:

GROUP: ${groupDescription} (${request.groupSize} person${request.groupSize > 1 ? 's' : ''})
OCCASION: ${request.occasion}
${request.style ? `STYLE: ${request.style}` : ''}

Return ONLY a valid JSON array with exactly 9 pose objects. Each object must have:
{
  "id": "unique_id_string",
  "name": "Creative pose name (short, catchy)",
  "description": "1-2 sentence vivid description of the pose",
  "instructions": ["Step 1...", "Step 2...", "Step 3...", "Step 4..."],
  "tips": ["Tip 1 for photographer or subject", "Tip 2..."],
  "difficulty": "Easy" | "Medium" | "Pro",
  "tags": ["tag1", "tag2", "tag3"],
  "groupSize": ${request.groupSize},
  "occasion": "${request.occasion}",
  "emoji": "single relevant emoji",
  "category": "casual" | "formal" | "romantic" | "fun" | "editorial" | "traditional" | "candid" | "action"
}

Make poses:
- Specific and actionable (not vague like "stand together")
- Culturally relevant (include some Indian/South Asian friendly poses)
- Varied in difficulty (3 Easy, 3 Medium, 3 Pro)
- Creative and trendy (Instagram/Pinterest worthy)
- Suitable for the ${request.occasion} occasion
- Practical for ${request.groupSize} person${request.groupSize > 1 ? 's' : ''}

Return ONLY the JSON array, no markdown, no explanation.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  // Clean the response - remove markdown code blocks if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  const poses: Pose[] = JSON.parse(cleaned)
  return poses
}

function getGroupDescription(size: number): string {
  if (size === 1) return 'Solo individual'
  if (size === 2) return 'Pair/Couple/Duo'
  if (size === 3) return 'Trio/3 friends'
  if (size === 4) return 'Small group of 4'
  if (size === 5) return 'Group of 5'
  if (size <= 8) return `Medium group of ${size}`
  return `Large group of ${size}+`
}

export async function generateQuickTips(groupSize: number, occasion: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

  const prompt = `Give 5 quick photography tips for a ${groupSize}-person ${occasion} photo shoot. 
  Return ONLY a JSON array of 5 short tip strings. No markdown.`

  const result = await model.generateContent(prompt)
  const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(text)
}
