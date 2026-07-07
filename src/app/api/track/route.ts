import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const gasUrl = process.env.GAS_URL
  if (!gasUrl) {
    return NextResponse.json({ ok: false, reason: 'GAS_URL not set' }, { status: 200 })
  }

  try {
    const body = await req.json()
    await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    // GAS 호출 실패해도 학습자 경험에 영향 없도록 200 반환
  }

  return NextResponse.json({ ok: true })
}
