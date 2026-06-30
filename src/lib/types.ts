export interface Profile {
  name: string
  email: string
  cohort: string
  createdAt: string
}

export interface Chapter {
  id: string
  number: string
  title: string
  titleEn: string
  sections: number
  estimatedMinutes: number
  quizCount: number
  practiceCount: number
  available: boolean
  group: 'basic' | 'advanced' | 'appendix'
}

export interface ChapterProgress {
  chapterId: string
  lectureCompleted: boolean
  lectureCompletedAt?: string
  practiceCompleted: number
}

export interface QuizQuestion {
  id: number
  level: 'basic' | 'intermediate' | 'advanced'
  question: string
  code?: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface QuizAttempt {
  chapterId: string
  score: number
  total: number
  answers: { questionId: number; selected: number; correct: boolean }[]
  completedAt: string
}

export interface PracticeProblem {
  id: number
  group: number
  groupTitle: string
  question: string
  sql: string
  result?: string
  keyPoint: string
}

export interface Inquiry {
  id: string
  chapterId: string
  problemNumber?: string
  type: 'lecture' | 'quiz_error' | 'other'
  content: string
  status: 'pending' | 'answered'
  answer?: string
  createdAt: string
}
