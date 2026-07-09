import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const type = data.type as string
    if (!['quiz', 'lecture', 'practice'].includes(type)) {
      return NextResponse.json({ ok: false, reason: 'unknown type' })
    }
    await kv.lpush(`track:${type}`, JSON.stringify(data))
    await kv.ltrim(`track:${type}`, 0, 999) // 유형별 최대 1000건 보관
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
  return NextResponse.json({ ok: true })
}
