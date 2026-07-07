import { getProfile } from './store'
import { getChapter } from '@/data/chapters'

export type TrackEvent =
  | { type: 'quiz';     chapterId: string; score: number; total: number }
  | { type: 'lecture';  chapterId: string }
  | { type: 'practice'; chapterId: string; completed: number; practiceTotal: number }

export async function track(event: TrackEvent): Promise<void> {
  if (typeof window === 'undefined') return
  const profile = getProfile()
  if (!profile) return
  const ch = getChapter(event.chapterId)

  const base = {
    type:         event.type,
    name:         profile.name,
    email:        profile.email,
    cohort:       profile.cohort,
    chapterId:    event.chapterId,
    chapterTitle: ch?.title ?? '',
    completedAt:  new Date().toISOString(),
  }

  const payload =
    event.type === 'quiz'
      ? { ...base, score: event.score, total: event.total, percent: Math.round((event.score / event.total) * 100) }
    : event.type === 'practice'
      ? { ...base, completed: event.completed, practiceTotal: event.practiceTotal }
      : base

  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // 사용자 경험을 방해하지 않도록 silent fail
  }
}
