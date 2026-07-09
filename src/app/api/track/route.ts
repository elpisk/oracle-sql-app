import { NextRequest, NextResponse } from 'next/server'

const TOKEN   = process.env.AIRTABLE_TOKEN
const BASE_ID = process.env.AIRTABLE_BASE_ID

const TABLE: Record<string, string> = {
  quiz:     '퀴즈결과',
  lecture:  '강의완료',
  practice: '실습완료',
}

const FIELDS: Record<string, (d: Record<string, unknown>) => Record<string, unknown>> = {
  quiz: d => ({
    이름: d.name, 이메일: d.email, 기수: d.cohort,
    챕터: d.chapterId, 챕터명: d.chapterTitle,
    점수: d.score, 문제수: d.total, 정답률: d.percent,
    완료일시: d.completedAt,
  }),
  lecture: d => ({
    이름: d.name, 이메일: d.email, 기수: d.cohort,
    챕터: d.chapterId, 챕터명: d.chapterTitle,
    완료일시: d.completedAt,
  }),
  practice: d => ({
    이름: d.name, 이메일: d.email, 기수: d.cohort,
    챕터: d.chapterId, 챕터명: d.chapterTitle,
    완료수: d.completed, 전체수: d.practiceTotal,
    완료일시: d.completedAt,
  }),
}

export async function POST(req: NextRequest) {
  if (!TOKEN || !BASE_ID) {
    return NextResponse.json({ ok: false, reason: 'Airtable env not set' })
  }

  try {
    const data   = await req.json()
    const table  = TABLE[data.type as string]
    const fields = FIELDS[data.type as string]
    if (!table || !fields) return NextResponse.json({ ok: false, reason: 'unknown type' })

    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: [{ fields: fields(data) }] }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ ok: false, status: res.status, airtableError: err })
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }

  return NextResponse.json({ ok: true })
}
