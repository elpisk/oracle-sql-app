'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, CheckCircle2, Lock, ChevronRight, Trophy, Target, Zap } from 'lucide-react'
import { getProfile, getStats, getBestScore, getProgress } from '@/lib/store'
import { CHAPTERS, GROUPS, CONTENT_READY } from '@/data/chapters'
import type { Profile } from '@/lib/types'
import ProgressBar from '@/components/ProgressBar'

export default function HomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats]     = useState({ completedChapters: 0, avgScore: null as number | null, totalAttempts: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const p = getProfile()
    if (!p) { router.replace('/profile/setup'); return }
    setProfile(p)
    setStats(getStats())
    setMounted(true)
  }, [router])

  if (!mounted) return null

  const groups = ['basic', 'advanced'] as const
  const totalChapters = CHAPTERS.length
  const progressPct = Math.round((stats.completedChapters / totalChapters) * 100)

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#1D1D1F] to-[#2D2D2F] text-white px-6 py-20 text-center fade-in">
        <p className="text-[13px] font-semibold text-apple-blue uppercase tracking-widest mb-4">Oracle Database 19c</p>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
          SQL Workshop
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          안녕하세요, <span className="text-white font-semibold">{profile?.name}</span>님 👋
        </p>

        {/* 진도 바 */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-[13px] text-gray-400 mb-2">
            <span>전체 진도</span>
            <span className="text-white font-semibold">{stats.completedChapters} / {totalChapters} 챕터</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-apple-blue transition-all duration-1000"
              style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </section>

      {/* 통계 카드 */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Trophy,  label: '완료 챕터',  value: `${stats.completedChapters}개`,  color: '#0071E3' },
            { icon: Target,  label: '퀴즈 평균',  value: stats.avgScore ? `${stats.avgScore}점` : '--',  color: '#AF52DE' },
            { icon: Zap,     label: '퀴즈 도전',  value: `${stats.totalAttempts}회`,       color: '#FF9500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-apple-lg p-5 shadow-apple text-center fade-up">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${color}15` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div className="text-2xl font-bold text-apple-text mb-1">{value}</div>
              <div className="text-[12px] text-apple-secondary">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 학습 가능 챕터 강조 */}
      {CONTENT_READY.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 rounded-full bg-apple-green" />
            <h2 className="text-xl font-bold text-apple-text">지금 학습 가능</h2>
            <span className="text-[13px] text-apple-secondary">{CONTENT_READY.length}개 챕터</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {CHAPTERS.filter(c => CONTENT_READY.slice(-5).includes(c.id)).map(ch => {
              const prog = getProgress(ch.id)
              const best = getBestScore(ch.id)
              return (
                <Link key={ch.id} href={`/chapters/${ch.id}`}
                  className="bg-white rounded-apple-xl shadow-apple p-5 hover:shadow-apple-md hover:-translate-y-1 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-apple-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[13px] font-bold text-apple-green">{ch.number}</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-apple-text leading-tight">{ch.title}</p>
                      <p className="text-[11px] text-apple-secondary">{ch.sections}섹션 · {ch.estimatedMinutes}분</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    {prog.lectureCompleted
                      ? <span className="text-apple-green font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> 강의 완료</span>
                      : <span className="text-apple-blue font-semibold">강의 시작 →</span>}
                    {best !== null && <span className="text-apple-purple font-semibold">최고 {best}점</span>}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* 전체 챕터 목록 */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {groups.map(g => {
          const chapters = CHAPTERS.filter(c => c.group === g)
          const { label, color } = GROUPS[g]
          return (
            <div key={g} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: color }} />
                <h2 className="text-xl font-bold text-apple-text">{label}</h2>
                <span className="text-[13px] text-apple-secondary">{chapters.length}챕터</span>
              </div>

              <div className="grid gap-3">
                {chapters.map(ch => {
                  const prog    = getProgress(ch.id)
                  const best    = getBestScore(ch.id)
                  const done    = prog.lectureCompleted
                  const locked  = !ch.available

                  return (
                    <div key={ch.id}
                      className={`bg-white rounded-apple-lg shadow-apple overflow-hidden transition-all ${
                        locked ? 'opacity-50' : 'hover:shadow-apple-md hover:-translate-y-0.5'
                      }`}>
                      {locked ? (
                        <div className="flex items-center p-4 gap-4">
                          <div className="w-10 h-10 rounded-xl bg-apple-gray-bg flex items-center justify-center flex-shrink-0">
                            <Lock size={16} className="text-apple-tertiary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-apple-tertiary">CH{ch.number}</span>
                              <span className="text-[13px] font-medium text-apple-secondary truncate">{ch.title}</span>
                            </div>
                            <span className="text-[12px] text-apple-tertiary">{ch.titleEn}</span>
                          </div>
                          <span className="text-[12px] text-apple-tertiary">준비 중</span>
                        </div>
                      ) : (
                        <Link href={`/chapters/${ch.id}`} className="flex items-center p-4 gap-4 group">
                          {/* 아이콘 */}
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                            style={{ backgroundColor: done ? '#34C75915' : `${color}15` }}>
                            {done
                              ? <CheckCircle2 size={20} className="text-apple-green" />
                              : <BookOpen size={20} style={{ color }} />
                            }
                          </div>

                          {/* 텍스트 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[11px] font-mono" style={{ color }}>{`CH${ch.number}`}</span>
                              <span className="text-[14px] font-semibold text-apple-text truncate">{ch.title}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-apple-secondary">
                              <span>{ch.sections}섹션 · {ch.estimatedMinutes}분</span>
                              {best !== null && (
                                <span className="font-semibold" style={{ color: best >= 80 ? '#34C759' : '#FF9500' }}>
                                  퀴즈 {best}점
                                </span>
                              )}
                              {prog.practiceCompleted > 0 && (
                                <span>실습 {prog.practiceCompleted}/{ch.practiceCount}</span>
                              )}
                            </div>
                            {done && (
                              <ProgressBar
                                value={Math.round((prog.practiceCompleted / ch.practiceCount) * 100)}
                                color={color} height={2} />
                            )}
                          </div>

                          {/* 화살표 */}
                          <ChevronRight size={16} className="text-apple-border group-hover:text-apple-secondary transition-colors flex-shrink-0" />
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
