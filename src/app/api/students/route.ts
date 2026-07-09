import { NextResponse } from 'next/server'

const TOKEN   = process.env.AIRTABLE_TOKEN
const BASE_ID = process.env.AIRTABLE_BASE_ID

async function fetchTable(tableName: string) {
  if (!TOKEN || !BASE_ID) return { rows: [], error: 'env not set' }
  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}` +
      `?sort[0][field]=완료일시&sort[0][direction]=desc&maxRecords=500`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: 0 },
    })
    const json = await res.json()
    if (!res.ok) return { rows: [], error: `${res.status}: ${JSON.stringify(json)}` }
    return { rows: (json.records ?? []).map((r: { fields: unknown }) => r.fields), error: null }
  } catch (e) {
    return { rows: [], error: String(e) }
  }
}

export async function GET() {
  if (!TOKEN || !BASE_ID) {
    return NextResponse.json({
      ok: false,
      reason: 'AIRTABLE_TOKEN 또는 AIRTABLE_BASE_ID 환경변수가 설정되지 않았습니다.',
      quizzes: [], lectures: [], practices: [],
    })
  }

  const [q, l, p] = await Promise.all([
    fetchTable('퀴즈결과'),
    fetchTable('강의완료'),
    fetchTable('실습완료'),
  ])

  return NextResponse.json({
    ok: true,
    quizzes:   q.rows,
    lectures:  l.rows,
    practices: p.rows,
    _debug: {
      quizError:    q.error,
      lectureError: l.error,
      practiceError: p.error,
    },
  })
}
