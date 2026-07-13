import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function POST(req: NextRequest) {
  try {
    const { email, chapterId, message } = await req.json()
    if (!email || !chapterId || !message?.trim()) {
      return NextResponse.json({ ok: false, reason: 'missing fields' })
    }
    const data = { email, chapterId, message: message.trim(), createdAt: new Date().toISOString() }
    await redis.set(`feedback:${email}:${chapterId}`, JSON.stringify(data))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email     = searchParams.get('email')
    const chapterId = searchParams.get('chapterId')
    if (!email || !chapterId) {
      return NextResponse.json({ ok: false, reason: 'missing params' })
    }
    const raw = await redis.get(`feedback:${email}:${chapterId}`)
    if (!raw) return NextResponse.json({ ok: true, feedback: null })
    const feedback = typeof raw === 'string' ? JSON.parse(raw) : raw
    return NextResponse.json({ ok: true, feedback })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
