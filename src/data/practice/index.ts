import type { PracticeProblem } from '@/lib/types'
import { ch01Practice } from './ch01'
import { ch02Practice } from './ch02'
import { ch03Practice } from './ch03'
import { ch22Practice } from './ch22'
import { ch23Practice } from './ch23'
import { ch24Practice } from './ch24'

const PRACTICE_MAP: Record<string, PracticeProblem[]> = {
  ch01: ch01Practice,
  ch02: ch02Practice,
  ch03: ch03Practice,
  ch22: ch22Practice,
  ch23: ch23Practice,
  ch24: ch24Practice,
}

export const getPractice = (chapterId: string): PracticeProblem[] =>
  PRACTICE_MAP[chapterId] ?? []
