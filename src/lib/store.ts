import type { Profile, ChapterProgress, QuizAttempt, Inquiry } from './types'

const KEYS = {
  profile:  'ora_profile',
  progress: 'ora_progress',
  quizzes:  'ora_quizzes',
  inquiries:'ora_inquiries',
} as const

function get<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

/* Profile */
export const getProfile   = (): Profile | null => get<Profile>(KEYS.profile)
export const saveProfile  = (p: Profile): void  => set(KEYS.profile, p)
export const hasProfile   = (): boolean          => !!getProfile()

/* Progress */
export const getAllProgress = (): Record<string, ChapterProgress> =>
  get<Record<string, ChapterProgress>>(KEYS.progress) ?? {}

export const getProgress = (chapterId: string): ChapterProgress =>
  getAllProgress()[chapterId] ?? {
    chapterId,
    lectureCompleted: false,
    practiceCompleted: 0,
  }

export const saveProgress = (p: ChapterProgress): void => {
  const all = getAllProgress()
  all[p.chapterId] = p
  set(KEYS.progress, all)
}

export const markLectureComplete = (chapterId: string): void => {
  const p = getProgress(chapterId)
  saveProgress({ ...p, lectureCompleted: true, lectureCompletedAt: new Date().toISOString() })
}

export const updatePracticeCompleted = (chapterId: string, count: number): void => {
  const p = getProgress(chapterId)
  saveProgress({ ...p, practiceCompleted: count })
}

/* Quiz history */
export const getAllQuizAttempts = (): QuizAttempt[] =>
  get<QuizAttempt[]>(KEYS.quizzes) ?? []

export const getQuizAttempts = (chapterId: string): QuizAttempt[] =>
  getAllQuizAttempts().filter(a => a.chapterId === chapterId)

export const getBestScore = (chapterId: string): number | null => {
  const attempts = getQuizAttempts(chapterId)
  if (!attempts.length) return null
  return Math.max(...attempts.map(a => Math.round((a.score / a.total) * 100)))
}

export const saveQuizAttempt = (attempt: QuizAttempt): void => {
  const all = getAllQuizAttempts()
  all.push(attempt)
  set(KEYS.quizzes, all)
}

/* Inquiries */
export const getInquiries = (): Inquiry[] =>
  get<Inquiry[]>(KEYS.inquiries) ?? []

export const saveInquiry = (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'authorName' | 'authorEmail' | 'authorCohort'>): void => {
  const profile = getProfile()
  const all = getInquiries()
  all.unshift({
    ...inquiry,
    id: crypto.randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    authorName:   profile?.name,
    authorEmail:  profile?.email,
    authorCohort: profile?.cohort,
  })
  set(KEYS.inquiries, all)
}

/* Admin */
export const getAdminAuth = (): boolean => get<boolean>('ora_admin_auth') ?? false
export const setAdminAuth = (v: boolean): void => set('ora_admin_auth', v)

export const answerInquiry = (id: string, answer: string): void => {
  const all = getInquiries()
  const idx = all.findIndex(i => i.id === id)
  if (idx < 0) return
  all[idx] = { ...all[idx], answer, status: 'answered' }
  set(KEYS.inquiries, all)
}

export const deleteInquiry = (id: string): void => {
  const filtered = getInquiries().filter(i => i.id !== id)
  set(KEYS.inquiries, filtered)
}

export const getHiddenChapters = (): string[] =>
  get<string[]>('ora_hidden_chapters') ?? []

export const setHiddenChapters = (ids: string[]): void =>
  set('ora_hidden_chapters', ids)

/* Stats */
export const getStats = () => {
  const progress = getAllProgress()
  const completed = Object.values(progress).filter(p => p.lectureCompleted).length
  const attempts  = getAllQuizAttempts()
  const avgScore  = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / attempts.length)
    : null
  return { completedChapters: completed, avgScore, totalAttempts: attempts.length }
}
