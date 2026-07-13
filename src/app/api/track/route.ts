import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const type = data.type as string
    if (!['quiz', 'lecture', 'practice'].includes(type)) {
      return NextResponse.json({ ok: false, reason: 'unknown type' })
    }
    await redis.lpush(`track:${type}`, JSON.stringify(data))
    await redis.ltrim(`track:${type}`, 0, 999)
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
  return NextResponse.json({ ok: true })
}
