import type { QuizQuestion } from '@/lib/types'
import { ch01Quiz } from './ch01'
import { ch02Quiz } from './ch02'
import { ch22Quiz } from './ch22'
import { ch23Quiz } from './ch23'
import { ch24Quiz } from './ch24'

const QUIZ_MAP: Record<string, QuizQuestion[]> = {
  ch01: ch01Quiz,
  ch02: ch02Quiz,
  ch22: ch22Quiz,
  ch23: ch23Quiz,
  ch24: ch24Quiz,
}

export const getQuiz = (chapterId: string): QuizQuestion[] =>
  QUIZ_MAP[chapterId] ?? []
