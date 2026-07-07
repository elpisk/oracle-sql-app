import type { QuizQuestion } from '@/lib/types'
import { ch01Quiz } from './ch01'
import { ch02Quiz } from './ch02'
import { ch03Quiz } from './ch03'
import { ch04Quiz } from './ch04'
import { ch05Quiz } from './ch05'
import { ch06Quiz } from './ch06'
import { ch07Quiz } from './ch07'
import { ch08Quiz } from './ch08'
import { ch09Quiz } from './ch09'
import { ch10Quiz } from './ch10'
import { ch11Quiz } from './ch11'
import { ch12Quiz } from './ch12'
import { ch13Quiz } from './ch13'
import { ch14Quiz } from './ch14'
import { ch15Quiz } from './ch15'
import { ch16Quiz } from './ch16'
import { ch17Quiz } from './ch17'
import { ch18Quiz } from './ch18'
import { ch19Quiz } from './ch19_new'
import { ch22Quiz } from './ch22'
import { ch23Quiz } from './ch23'
import { ch24Quiz } from './ch24'

const QUIZ_MAP: Record<string, QuizQuestion[]> = {
  ch01: ch01Quiz,
  ch02: ch02Quiz,
  ch03: ch03Quiz,
  ch04: ch04Quiz,
  ch05: ch05Quiz,
  ch06: ch06Quiz,
  ch07: ch07Quiz,
  ch08: ch08Quiz,
  ch09: ch09Quiz,
  ch10: ch10Quiz,
  ch11: ch11Quiz,
  ch12: ch12Quiz,
  ch13: ch13Quiz,
  ch14: ch14Quiz,
  ch15: ch15Quiz,
  ch16: ch16Quiz,
  ch17: ch17Quiz,
  ch18: ch18Quiz,
  ch19: ch19Quiz,
  ch22: ch22Quiz,
  ch23: ch23Quiz,
  ch24: ch24Quiz,
}

export const getQuiz = (chapterId: string): QuizQuestion[] =>
  QUIZ_MAP[chapterId] ?? []
