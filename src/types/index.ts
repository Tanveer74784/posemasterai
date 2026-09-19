export interface Pose {
  id: string
  name: string
  description: string
  instructions: string[]
  tips: string[]
  difficulty: 'Easy' | 'Medium' | 'Pro'
  tags: string[]
  groupSize: number
  occasion: string
  emoji: string
  category: PoseCategory
}

export type PoseCategory =
  | 'casual'
  | 'formal'
  | 'romantic'
  | 'fun'
  | 'editorial'
  | 'traditional'
  | 'candid'
  | 'action'

export type Occasion =
  | 'casual'
  | 'wedding'
  | 'party'
  | 'professional'
  | 'travel'
  | 'family'
  | 'friends'
  | 'romantic'
  | 'birthday'
  | 'festival'

export interface PoseRequest {
  groupSize: number
  occasion: Occasion
  style?: string
}

export interface PoseResponse {
  poses: Pose[]
  tips: string[]
  error?: string
}

export const OCCASIONS: { value: Occasion; label: string; emoji: string; description: string }[] = [
  { value: 'casual', label: 'Casual', emoji: '😎', description: 'Everyday, relaxed vibes' },
  { value: 'wedding', label: 'Wedding', emoji: '💍', description: 'Shaadi & ceremonies' },
  { value: 'party', label: 'Party', emoji: '🎉', description: 'Celebrations & gatherings' },
  { value: 'professional', label: 'Professional', emoji: '💼', description: 'Office & formal events' },
  { value: 'travel', label: 'Travel', emoji: '✈️', description: 'Trips & outdoor adventures' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Family portraits & reunions' },
  { value: 'friends', label: 'Friends', emoji: '🤝', description: 'Bestie hangouts' },
  { value: 'romantic', label: 'Romantic', emoji: '❤️', description: 'Date & couple moments' },
  { value: 'birthday', label: 'Birthday', emoji: '🎂', description: 'Birthday celebrations' },
  { value: 'festival', label: 'Festival', emoji: '🎊', description: 'Diwali, Holi, Eid & more' },
]

export const GROUP_SIZES = [
  { value: 1, label: 'Solo', emoji: '🧍', description: 'Just me!' },
  { value: 2, label: 'Duo', emoji: '👫', description: '2 people' },
  { value: 3, label: 'Trio', emoji: '👥', description: '3 people' },
  { value: 4, label: 'Quad', emoji: '👯', description: '4 people' },
  { value: 5, label: 'Group 5', emoji: '🫂', description: '5 people' },
  { value: 6, label: 'Group 6+', emoji: '👨‍👩‍👧‍👦', description: '6 or more' },
  { value: 10, label: 'Large Group', emoji: '🎊', description: '10+ people' },
]

export const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Pro: 'bg-red-500/20 text-red-400 border-red-500/30',
}
