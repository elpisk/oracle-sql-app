'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, PenSquare, Code2, ChevronRight, Clock, CheckCircle2 } from 'lucide-react'
import { getChapter } from '@/data/chapters'
import { getProgress, getBestScore, markLectureComplete } from '@/lib/store'
import { track } from '@/lib/tracker_new'
import { useEffect, useState } from 'react'

export default function ChapterDetail() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const ch      = getChapter(id)
  const [prog, setProg] = useState<import('@/lib/types').ChapterProgress>({ chapterId: id, lectureCompleted: false, practiceCompleted: 0 })
  const [best, setBest] = useState<number | null>(null)

  useEffect(() => {
    setProg(getProgress(id))
    setBest(getBestScore(id))
  }, [id])

  if (!ch) { router.push('/'); return null }

  const handleLectureStart = () => {
    markLectureComplete(id)
    setProg(getProgress(id))
    track({ type: 'lecture', chapterId: id })
    router.push(`/chapters/${id}/lecture`)
  }

  const tiles = [
    {
      icon: BookOpen, label: '강의 내용', desc: `${ch.sections}개 섹션 · ${ch.estimatedMinutes}분`,
      color: '#0071E3', done: prog.lectureCompleted,
      action: handleLectureStart,
      href: undefined,
    },
    {
      icon: PenSquare, label: '퀴즈', desc: `${ch.quizCount}문제 (하·중·상)`,
      color: '#AF52DE', done: best !== null,
      extra: best !== null ? `최고 ${best}점` : undefined,
      href: `/chapters/${id}/quiz`,
      action: undefined,
    },
    {
      icon: Code2, label: '실습 문제', desc: `${ch.practiceCount}문제`,
      color: '#34C759', done: prog.practiceCompleted > 0 && prog.practiceCompleted >= ch.practiceCount,
      extra: prog.practiceCompleted > 0 ? `${prog.practiceCompleted}/${ch.practiceCount} 완료` : undefined,
      href: `/chapters/${id}/practice`,
      action: undefined,
    },
  ]

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* 헤더 */}
      <div className="bg-gradient-to-b from-[#1D1D1F] to-[#2D2D2F] text-white px-6 pt-10 pb-16">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-[13px] mb-8 transition-colors">
            <ArrowLeft size={15} /> 목록으로
          </button>
          <p className="text-apple-blue text-[13px] font-semibold mb-2">Chapter {ch.number}</p>
          <h1 className="text-4xl font-bold mb-2">{ch.title}</h1>
          <p className="text-gray-400 text-lg">{ch.titleEn}</p>
          <div className="flex items-center gap-4 mt-4 text-[13px] text-gray-400">
            <span className="flex items-center gap-1.5"><Clock size={13} />{ch.estimatedMinutes}분</span>
            <span>{ch.sections}개 섹션</span>
          </div>
        </div>
      </div>

      {/* 학습 카드 */}
      <div className="max-w-2xl mx-auto px-6 -mt-8 pb-20 space-y-4 fade-up">
        {tiles.map(({ icon: Icon, label, desc, color, done, extra, href, action }) => {
          const Inner = (
            <div className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}>
                {done
                  ? <CheckCircle2 size={22} style={{ color }} />
                  : <Icon size={22} style={{ color }} />
                }
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-apple-text mb-0.5">{label}</div>
                <div className="text-[13px] text-apple-secondary">{desc}</div>
                {extra && <div className="text-[12px] font-semibold mt-0.5" style={{ color }}>{extra}</div>}
              </div>
              <ChevronRight size={16} className="text-apple-border flex-shrink-0" />
            </div>
          )

          return (
            <div key={label}
              className="bg-white rounded-apple-lg shadow-apple overflow-hidden transition-all hover:shadow-apple-md hover:-translate-y-0.5 cursor-pointer">
              {href
                ? <Link href={href}>{Inner}</Link>
                : <button className="w-full text-left" onClick={action}>{Inner}</button>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
