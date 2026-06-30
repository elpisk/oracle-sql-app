'use client'
import Link from 'next/link'
import { Lock, ChevronRight, Clock } from 'lucide-react'
import { CHAPTERS, GROUPS } from '@/data/chapters'
import { getAllProgress } from '@/lib/store'
import Badge from '@/components/Badge'
import { useEffect, useState } from 'react'
import type { ChapterProgress } from '@/lib/types'

const GROUP_ORDER: Array<'basic' | 'advanced' | 'appendix'> = ['basic', 'advanced', 'appendix']

export default function ChaptersPage() {
  const [progress, setProgress] = useState<Record<string, ChapterProgress>>({})

  useEffect(() => {
    setProgress(getAllProgress())
  }, [])

  return (
    <div className="min-h-screen bg-apple-bg pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-b from-[#1D1D1F] to-[#2D2D2F] text-white px-6 pt-14 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">강의 목록</h1>
          <p className="text-gray-400 text-lg">Oracle Database 19c SQL Workshop</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-10 pt-10 fade-up">
        {GROUP_ORDER.map(groupId => {
          const group = GROUPS[groupId]
          const chapters = CHAPTERS.filter(c => c.group === groupId)
          if (!chapters.length) return null

          return (
            <section key={groupId}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: group.color }} />
                <h2 className="text-[17px] font-bold text-apple-text">{group.label}</h2>
                <span className="text-[13px] text-apple-secondary">{chapters.length}개 챕터</span>
              </div>

              <div className="space-y-2">
                {chapters.map(ch => {
                  const prog = progress[ch.id]
                  const isLocked = !ch.available
                  const lectureDone = prog?.lectureCompleted ?? false
                  const practicePct = ch.practiceCount > 0
                    ? Math.round(((prog?.practiceCompleted ?? 0) / ch.practiceCount) * 100)
                    : 0

                  return (
                    <div key={ch.id}
                      className={`bg-white rounded-apple-lg shadow-apple overflow-hidden transition-all ${
                        isLocked ? 'opacity-60' : 'hover:shadow-apple-md hover:-translate-y-0.5'
                      }`}>
                      {isLocked ? (
                        <div className="flex items-center gap-4 px-5 py-4">
                          <div className="w-10 h-10 rounded-xl bg-apple-gray-bg flex items-center justify-center flex-shrink-0">
                            <Lock size={16} className="text-apple-tertiary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-semibold text-apple-secondary">CH {ch.number}</p>
                            <p className="text-[15px] font-semibold text-apple-text">{ch.title}</p>
                          </div>
                          <Badge variant="locked" size="sm" />
                        </div>
                      ) : (
                        <Link href={`/chapters/${ch.id}`} className="flex items-center gap-4 px-5 py-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${group.color}18` }}>
                            <span className="text-[13px] font-bold" style={{ color: group.color }}>{ch.number}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-semibold text-apple-text truncate mb-0.5">{ch.title}</p>
                            <div className="flex items-center gap-3 text-[12px] text-apple-secondary">
                              <span className="flex items-center gap-1"><Clock size={11} />{ch.estimatedMinutes}분</span>
                              {lectureDone && <span className="text-apple-green font-semibold">강의 완료</span>}
                              {practicePct > 0 && <span className="text-apple-blue font-semibold">실습 {practicePct}%</span>}
                            </div>
                          </div>
                          <ChevronRight size={15} className="text-apple-border flex-shrink-0" />
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
