'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, Code2, EyeOff } from 'lucide-react'
import { getChapter } from '@/data/chapters'
import { getPractice } from '@/data/practice'
import { updatePracticeCompleted, getProgress } from '@/lib/store'

export default function PracticePage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const ch      = getChapter(id)
  const problems = getPractice(id)

  const [sqlRevealed, setSqlRevealed] = useState<Set<number>>(new Set())
  const [checked,     setChecked]     = useState<Set<number>>(new Set())
  const [openGroup,   setOpenGroup]   = useState<number>(1)

  useEffect(() => {
    const p = getProgress(id)
    if (p.practiceCompleted > 0) {
      setChecked(new Set(Array.from({ length: p.practiceCompleted }, (_, i) => i)))
    }
  }, [id])

  if (!ch || !problems.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-apple-secondary">준비 중인 콘텐츠입니다.</p>
    </div>
  )

  const groups = [...new Set(problems.map(p => p.group))].sort()

  const toggleSql = (probId: number) =>
    setSqlRevealed(prev => { const s = new Set(prev); s.has(probId) ? s.delete(probId) : s.add(probId); return s })

  const toggleCheck = (idx: number) => {
    setChecked(prev => {
      const s = new Set(prev); s.has(idx) ? s.delete(idx) : s.add(idx)
      updatePracticeCompleted(ch.id, s.size)
      return s
    })
  }

  const donePct = Math.round((checked.size / problems.length) * 100)

  return (
    <div className="min-h-screen bg-apple-bg pb-20">
      {/* 상단 */}
      <div className="sticky top-[52px] z-40 bg-white/90 border-b border-apple-border px-6 py-3"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => router.push(`/chapters/${id}`)}
              className="flex items-center gap-1 text-[13px] text-apple-secondary hover:text-apple-text transition-colors">
              <ArrowLeft size={14} /> CH{ch.number} 실습
            </button>
            <span className="text-[13px] font-semibold text-apple-green">{checked.size}/{problems.length} 완료</span>
          </div>
          <div className="h-1 rounded-full bg-apple-gray-bg overflow-hidden">
            <div className="h-full bg-apple-green rounded-full transition-all duration-500"
              style={{ width: `${donePct}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-6 space-y-4">
        {groups.map(g => {
          const groupProblems = problems.filter(p => p.group === g)
          const groupTitle    = groupProblems[0].groupTitle
          const isOpen        = openGroup === g

          return (
            <div key={g} className="bg-white rounded-apple-lg shadow-apple overflow-hidden">
              {/* 그룹 헤더 */}
              <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-apple-gray-bg/50 transition-colors"
                onClick={() => setOpenGroup(isOpen ? 0 : g)}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-apple-blue flex items-center justify-center">
                    <span className="text-white text-[12px] font-bold">{g}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-apple-text">{groupTitle}</span>
                  <span className="text-[12px] text-apple-secondary">{groupProblems.length}문제</span>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-apple-secondary" /> : <ChevronDown size={16} className="text-apple-secondary" />}
              </button>

              {/* 문제 목록 */}
              {isOpen && (
                <div className="border-t border-apple-border divide-y divide-apple-border/50">
                  {groupProblems.map((prob) => {
                    const globalIdx   = problems.indexOf(prob)
                    const isSqlShown  = sqlRevealed.has(prob.id)
                    const isDone      = checked.has(globalIdx)

                    return (
                      <div key={prob.id} className="p-5">
                        {/* 문제 */}
                        <div className="flex items-start gap-3 mb-4">
                          <button onClick={() => toggleCheck(globalIdx)}
                            className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 transition-colors ${
                              isDone ? 'bg-apple-green border-apple-green' : 'border-apple-border hover:border-apple-green'
                            }`}>
                            {isDone && (
                              <svg viewBox="0 0 12 12" className="w-full h-full p-0.5">
                                <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                              </svg>
                            )}
                          </button>
                          <p className="text-[14px] text-apple-text leading-relaxed flex-1">
                            <span className="font-semibold text-apple-secondary mr-2">[{globalIdx + 1}번]</span>
                            {prob.question}
                          </p>
                        </div>

                        {/* 결과 예시 — 항상 표시 */}
                        {prob.result && (
                          <div className="bg-[#F0F9FF] border border-apple-blue/20 rounded-apple px-4 py-3 mb-3">
                            <p className="text-[11px] font-semibold text-apple-blue mb-1.5">결과 예시</p>
                            <div className="text-[12px] text-apple-text whitespace-pre-wrap font-mono leading-relaxed">{prob.result}</div>
                          </div>
                        )}

                        {/* 키포인트 — 항상 표시 */}
                        <div className="bg-blue-50 border border-apple-blue/20 rounded-apple px-4 py-3 mb-3">
                          <p className="text-[11px] font-semibold text-apple-blue mb-1">💡 키포인트</p>
                          <p className="text-[13px] text-apple-text">{prob.keyPoint}</p>
                        </div>

                        {/* SQL 토글 */}
                        <button onClick={() => toggleSql(prob.id)}
                          className="flex items-center gap-1.5 text-[13px] text-apple-secondary font-medium hover:text-apple-text transition-colors">
                          {isSqlShown
                            ? <><EyeOff size={13} /> SQL 숨기기</>
                            : <><Code2 size={13} /> 정답 SQL 보기</>
                          }
                        </button>

                        {isSqlShown && (
                          <div className="mt-3 fade-in">
                            <pre className="text-[12px]"><code className="text-green-400">{prob.sql}</code></pre>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
