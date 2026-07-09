import { NextResponse } from 'next/server'

const TOKEN   = process.env.AIRTABLE_TOKEN
const BASE_ID = process.env.AIRTABLE_BASE_ID

async function fetchTable(tableName: string) {
  if (!TOKEN || !BASE_ID) return []
  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}` +
      `?sort[0][field]=완료일시&sort[0][direction]=desc&maxRecords=500`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      next: { revalidate: 0 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return (json.records ?? []).map((r: { fields: unknown }) => r.fields)
  } catch {
    return []
  }
}

export async function GET() {
  const [quizzes, lectures, practices] = await Promise.all([
    fetchTable('퀴즈결과'),
    fetchTable('강의완료'),
    fetchTable('실습완료'),
  ])
  return NextResponse.json({ quizzes, lectures, practices })
}
