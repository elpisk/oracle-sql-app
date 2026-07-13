import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function GET() {
  try {
    const [quizRaw, lectureRaw, practiceRaw] = await Promise.all([
      redis.lrange('track:quiz', 0, 499),
      redis.lrange('track:lecture', 0, 499),
      redis.lrange('track:practice', 0, 499),
    ])

    const parse = (rows: unknown[]) =>
      rows.map(r => (typeof r === 'string' ? JSON.parse(r) : r))

    return NextResponse.json({
      ok: true,
      quizzes:   parse(quizRaw),
      lectures:  parse(lectureRaw),
      practices: parse(practiceRaw),
    })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e), quizzes: [], lectures: [], practices: [] })
  }
}
