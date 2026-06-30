'use client'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Trophy, RotateCcw, ArrowRight } from 'lucide-react'
import { getChapter } from '@/data/chapters'

function ResultContent() {
  const { id }   = useParams<{ id: string }>()
  const sp       = useSearchParams()
  const router   = useRouter()
  const ch       = getChapter(id)
  const score    = Number(sp.get('score') ?? 0)
  const total    = Number(sp.get('total') ?? 50)
  const pct      = Math.round((score / total) * 100)

  const grade = pct >= 90 ? { label: '🏆 우수', color: '#FF9500' }
              : pct >= 70 ? { label: '✅ 통과',  color: '#34C759' }
              : { label: '📖 복습 필요', color: '#AF52DE' }

  const tiers = [
    { label: '하(기초)',  total: 20, correct: Math.round(score * 0.45) },
    { label: '중(응용)',  total: 16, correct: Math.round(score * 0.32) },
    { label: '상(심화)',  total: 14, correct: Math.round(score * 0.23) },
  ]

  return (
    <div className="min-h-screen bg-apple-bg flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-md fade-up">
        {/* 점수 */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: `conic-gradient(${grade.color} ${pct * 3.6}deg, #F5F5F7 0deg)` }}>
            <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-apple-text">{pct}</span>
              <span className="text-[11px] text-apple-secondary">점</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-apple-text mb-2">{score} / {total}문제 정답</h1>
          <span className="inline-block px-4 py-1.5 rounded-full text-white text-[14px] font-semibold"
            style={{ backgroundColor: grade.color }}>{grade.label}</span>
          {ch && <p className="text-apple-secondary text-[14px] mt-3">CH{ch.number} {ch.title}</p>}
        </div>

        {/* 난이도별 */}
        <div className="bg-white rounded-apple-xl shadow-apple p-6 mb-4">
          <h3 className="text-[14px] font-semibold text-apple-text mb-4">난이도별 결과</h3>
          <div className="space-y-4">
            {tiers.map(({ label, total: t, correct: c }) => {
              const p = Math.round((c / t) * 100)
              const col = p >= 80 ? '#34C759' : p >= 60 ? '#FF9500' : '#FF3B30'
              return (
                <div key={label}>
                  <div className="flex justify-between text-[13px] mb-1.5">
                    <span className="text-apple-secondary">{label}</span>
                    <span className="font-semibold" style={{ color: col }}>{c}/{t} · {p}점</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-apple-gray-bg overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p}%`, backgroundColor: col }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <button onClick={() => router.push(`/chapters/${id}/quiz`)}
            className="w-full h-12 border-2 border-apple-border rounded-full text-apple-text font-semibold text-[15px] hover:bg-apple-gray-bg transition-colors flex items-center justify-center gap-2">
            <RotateCcw size={16} /> 다시 풀기
          </button>
          <Link href={`/chapters/${id}/practice`}
            className="w-full h-12 bg-apple-blue hover:bg-apple-blue-dark text-white font-semibold text-[15px] rounded-full transition-colors flex items-center justify-center gap-2">
            실습 문제로 이동 <ArrowRight size={16} />
          </Link>
          <Link href={`/chapters/${id}`}
            className="block text-center text-[13px] text-apple-secondary hover:text-apple-text py-2 transition-colors">
            챕터 홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return <Suspense><ResultContent /></Suspense>
}
