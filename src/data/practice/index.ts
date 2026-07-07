import type { PracticeProblem } from '@/lib/types'
import { ch01Practice } from './ch01'
import { ch02Practice } from './ch02'
import { ch03Practice } from './ch03'
import { ch04Practice } from './ch04'
import { ch05Practice } from './ch05'
import { ch06Practice } from './ch06'
import { ch07Practice } from './ch07'
import { ch08Practice } from './ch08'
import { ch09Practice } from './ch09'
import { ch10Practice } from './ch10'
import { ch11Practice } from './ch11'
import { ch12Practice } from './ch12'
import { ch13Practice } from './ch13'
import { ch14Practice } from './ch14'
import { ch15Practice } from './ch15'
import { ch16Practice } from './ch16'
import { ch17Practice } from './ch17'
import { ch18Practice } from './ch18'
import { ch19Practice } from './ch19_new'
import { ch20Practice } from './ch20_new'
import { ch22Practice } from './ch22'
import { ch23Practice } from './ch23'
import { ch24Practice } from './ch24'

const PRACTICE_MAP: Record<string, PracticeProblem[]> = {
  ch01: ch01Practice,
  ch02: ch02Practice,
  ch03: ch03Practice,
  ch04: ch04Practice,
  ch05: ch05Practice,
  ch06: ch06Practice,
  ch07: ch07Practice,
  ch08: ch08Practice,
  ch09: ch09Practice,
  ch10: ch10Practice,
  ch11: ch11Practice,
  ch12: ch12Practice,
  ch13: ch13Practice,
  ch14: ch14Practice,
  ch15: ch15Practice,
  ch16: ch16Practice,
  ch17: ch17Practice,
  ch18: ch18Practice,
  ch19: ch19Practice,
  ch20: ch20Practice,
  ch22: ch22Practice,
  ch23: ch23Practice,
  ch24: ch24Practice,
}

export const getPractice = (chapterId: string): PracticeProblem[] =>
  PRACTICE_MAP[chapterId] ?? []
