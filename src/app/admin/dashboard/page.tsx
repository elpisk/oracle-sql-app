'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart2, MessageSquare, BookOpen, Settings,
  LogOut, CheckCircle2, Clock, Eye, EyeOff,
  ChevronDown, Send, Trash2, ToggleLeft, ToggleRight,
} from 'lucide-react'
import {
  getAdminAuth, setAdminAuth,
  getAllProgress, getAllQuizAttempts, getBestScore,
  getInquiries, answerInquiry, deleteInquiry,
  getHiddenChapters, setHiddenChapters,
} from '@/lib/store'
import { CHAPTERS, CONTENT_READY } from '@/data/chapters'
import { getQuiz } from '@/data/quiz'
import { getPractice } from '@/data/practice'
import type { Inquiry, QuizQuestion, PracticeProblem } from '@/lib/types'

type Tab = 'stats' | 'inquiries' | 'questions' | 'chapters'
type InquiryType = 'lecture' | 'quiz_error' | 'other'
const TYPE_LABELS: Record<InquiryType, string> = {
  lecture: '강의 내용',
  quiz_error: '퀴즈 오류',
  other: '기타',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab]             = useState<Tab>('stats')
  const [mounted, setMounted]     = useState(false)

  // 통계
  const [progressData, setProgressData] = useState<ReturnType<typeof getAllProgress>>({})
  const [attempts, setAttempts]         = useState<ReturnType<typeof getAllQuizAttempts>>([])

  // 문의
  const [inquiries, setInquiries]       = useState<Inquiry[]>([])
  const [answerMap, setAnswerMap]       = useState<Record<string, string>>({})
  const [inqFilter, setInqFilter]       = useState<'all' | 'pending' | 'answered'>('all')

  // 문제 열람
  const [selChapter, setSelChapter]     = useState('ch01')
  const [qType, setQType]               = useState<'quiz' | 'practice'>('quiz')
  const [showAnswer, setShowAnswer]     = useState<Record<number, boolean>>({})
  const [quizData, setQuizData]         = useState<QuizQuestion[]>([])
  const [practiceData, setPracticeData] = useState<PracticeProblem[]>([])

  // 챕터 관리
  const [hidden, setHidden]             = useState<string[]>([])

  useEffect(() => {
    if (!getAdminAuth()) { router.replace('/admin'); return }
    setProgressData(getAllProgress())
    setAttempts(getAllQuizAttempts())
    setInquiries(getInquiries())
    setHidden(getHiddenChapters())
    setMounted(true)
  }, [router])

  useEffect(() => {
    if (!mounted) return
    setQuizData(getQuiz(selChapter))
    setPracticeData(getPractice(selChapter))
    setShowAnswer({})
  }, [selChapter, mounted])

  if (!mounted) return null

  const handleLogout = () => { setAdminAuth(false); router.replace('/') }

  // ── 통계 계산 ──
  const completedCount  = Object.values(progressData).filter(p => p.lectureCompleted).length
  const totalAttempts   = attempts.length
  const avgScore        = totalAttempts
    ? Math.round(attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / totalAttempts)
    : 0
  const totalPractice   = Object.values(progressData).reduce((s, p) => s + (p.practiceCompleted ?? 0), 0)

  // ── 문의 답변 ──
  const handleAnswer = (id: string) => {
    const text = answerMap[id]?.trim()
    if (!text) return
    answerInquiry(id, text)
    setInquiries(getInquiries())
    setAnswerMap(m => { const n = { ...m }; delete n[id]; return n })
  }

  const handleDelete = (id: string) => {
    if (!confirm('이 문의를 삭제할까요?')) return
    deleteInquiry(id)
    setInquiries(getInquiries())
  }

  const filteredInquiries = inquiries.filter(i =>
    inqFilter === 'all' ? true : i.status === inqFilter
  )

  // ── 챕터 공개 토글 ──
  const toggleHidden = (id: string) => {
    const next = hidden.includes(id) ? hidden.filter(h => h !== id) : [...hidden, id]
    setHidden(next)
    setHiddenChapters(next)
  }

  const TABS: { key: Tab; label: string; icon: typeof BarChart2 }[] = [
    { key: 'stats',     label: '학습 현황',  icon: BarChart2 },
    { key: 'inquiries', label: '문의 관리',  icon: MessageSquare },
    { key: 'questions', label: '문제 열람',  icon: BookOpen },
    { key: 'chapters',  label: '챕터 관리',  icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-apple-bg">
      {/* 상단 헤더 */}
      <header className="bg-gradient-to-r from-[#1D1D1F] to-[#2D2D2F] text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Admin</p>
            <h1 className="text-xl font-bold">Oracle SQL Workshop 관리자</h1>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-white transition-colors">
            <LogOut size={15} /> 로그아웃
          </button>
        </div>
      </header>

      {/* 탭 */}
      <div className="sticky top-0 z-40 bg-white/90 border-b border-apple-border"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-5xl mx-auto flex">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-semibold transition-colors border-b-2 ${
                tab === key
                  ? 'text-apple-blue border-apple-blue'
                  : 'text-apple-secondary border-transparent hover:text-apple-text'
              }`}>
              <Icon size={15} />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ══════════ 탭 1: 학습 현황 ══════════ */}
        {tab === 'stats' && (
          <div className="space-y-6 fade-in">
            {/* 요약 카드 4개 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '완료 챕터',    value: `${completedCount}`,  sub: `/ ${CHAPTERS.length}개`,  color: '#0071E3' },
                { label: '퀴즈 도전',   value: `${totalAttempts}`,  sub: '회',                         color: '#AF52DE' },
                { label: '퀴즈 평균',   value: totalAttempts ? `${avgScore}점` : '--',  sub: '',        color: '#FF9500' },
                { label: '실습 완료',   value: `${totalPractice}`,  sub: '문제',                       color: '#34C759' },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="bg-white rounded-apple-lg shadow-apple p-5 text-center">
                  <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}<span className="text-sm font-normal text-apple-secondary ml-1">{sub}</span></div>
                  <div className="text-[12px] text-apple-secondary">{label}</div>
                </div>
              ))}
            </div>

            {/* 챕터별 진도 테이블 */}
            <div className="bg-white rounded-apple-xl shadow-apple overflow-hidden">
              <div className="px-5 py-4 border-b border-apple-border">
                <h2 className="text-[15px] font-bold text-apple-text">챕터별 진도 현황</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-apple-gray-bg text-apple-secondary">
                      <th className="text-left px-5 py-2.5 font-semibold">챕터</th>
                      <th className="text-center px-4 py-2.5 font-semibold">강의</th>
                      <th className="text-center px-4 py-2.5 font-semibold">실습</th>
                      <th className="text-center px-4 py-2.5 font-semibold">퀴즈 최고점</th>
                      <th className="text-center px-4 py-2.5 font-semibold">퀴즈 시도</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHAPTERS.filter(c => CONTENT_READY.includes(c.id)).map(ch => {
                      const prog  = progressData[ch.id]
                      const best  = getBestScore(ch.id)
                      const tries = attempts.filter(a => a.chapterId === ch.id).length
                      const pracPct = prog
                        ? Math.round((prog.practiceCompleted / ch.practiceCount) * 100)
                        : 0
                      return (
                        <tr key={ch.id} className="border-t border-apple-border hover:bg-apple-gray-bg/50">
                          <td className="px-5 py-3">
                            <span className="font-semibold text-apple-text">CH{ch.number}</span>
                            <span className="text-apple-secondary ml-2">{ch.title}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {prog?.lectureCompleted
                              ? <CheckCircle2 size={15} className="text-apple-green inline" />
                              : <span className="text-apple-tertiary">—</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {prog?.practiceCompleted
                              ? <span className={pracPct === 100 ? 'text-apple-green font-semibold' : 'text-apple-orange font-semibold'}>{pracPct}%</span>
                              : <span className="text-apple-tertiary">—</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {best !== null
                              ? <span className={`font-semibold ${best >= 80 ? 'text-apple-green' : best >= 60 ? 'text-apple-orange' : 'text-red-500'}`}>{best}점</span>
                              : <span className="text-apple-tertiary">—</span>}
                          </td>
                          <td className="px-4 py-3 text-center text-apple-secondary">
                            {tries > 0 ? `${tries}회` : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ 탭 2: 문의 관리 ══════════ */}
        {tab === 'inquiries' && (
          <div className="space-y-4 fade-in">
            {/* 필터 + 카운트 */}
            <div className="flex items-center gap-3">
              {(['all', 'pending', 'answered'] as const).map(f => (
                <button key={f} onClick={() => setInqFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                    inqFilter === f
                      ? 'bg-apple-blue text-white'
                      : 'bg-white text-apple-secondary border border-apple-border hover:border-apple-blue'
                  }`}>
                  {f === 'all' ? `전체 (${inquiries.length})` : f === 'pending' ? `대기 (${inquiries.filter(i => i.status === 'pending').length})` : `완료 (${inquiries.filter(i => i.status === 'answered').length})`}
                </button>
              ))}
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="bg-white rounded-apple-xl shadow-apple text-center py-16 text-apple-secondary">
                <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-[14px]">문의가 없습니다.</p>
              </div>
            ) : (
              filteredInquiries.map(inq => {
                const ch = CHAPTERS.find(c => c.id === inq.chapterId)
                const isPending = inq.status === 'pending'
                return (
                  <div key={inq.id} className="bg-white rounded-apple-xl shadow-apple p-5 space-y-3">
                    {/* 헤더 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-apple-blue bg-blue-50 px-2 py-0.5 rounded-full">
                          {TYPE_LABELS[inq.type as InquiryType]}
                        </span>
                        {ch && <span className="text-[12px] text-apple-secondary">CH{ch.number} {ch.title}</span>}
                        {inq.problemNumber && <span className="text-[12px] text-apple-secondary">· {inq.problemNumber}</span>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`flex items-center gap-1 text-[11px] font-semibold ${isPending ? 'text-apple-orange' : 'text-apple-green'}`}>
                          {isPending ? <><Clock size={11} />대기</> : <><CheckCircle2 size={11} />완료</>}
                        </span>
                        <button onClick={() => handleDelete(inq.id)}
                          className="p-1 text-apple-tertiary hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* 문의 내용 */}
                    <p className="text-[14px] text-apple-text leading-relaxed bg-apple-gray-bg rounded-apple px-4 py-3">
                      {inq.content}
                    </p>

                    {/* 기존 답변 */}
                    {inq.answer && (
                      <div className="bg-blue-50 border border-apple-blue/20 rounded-apple px-4 py-3">
                        <p className="text-[11px] font-semibold text-apple-blue mb-1">강사 답변</p>
                        <p className="text-[13px] text-apple-text">{inq.answer}</p>
                      </div>
                    )}

                    {/* 답변 입력 */}
                    <div className="flex gap-2">
                      <textarea
                        value={answerMap[inq.id] ?? ''}
                        onChange={e => setAnswerMap(m => ({ ...m, [inq.id]: e.target.value }))}
                        placeholder={inq.answer ? '답변 수정...' : '답변 입력...'}
                        rows={2}
                        className="flex-1 rounded-apple border border-apple-border px-3 py-2 text-[13px] resize-none focus:outline-none focus:border-apple-blue transition-colors placeholder:text-apple-tertiary"
                      />
                      <button
                        onClick={() => handleAnswer(inq.id)}
                        disabled={!answerMap[inq.id]?.trim()}
                        className="px-4 py-2 rounded-apple bg-apple-blue text-white text-[13px] font-semibold hover:bg-apple-blue-dark transition-colors disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0 self-end">
                        <Send size={13} /> {inq.answer ? '수정' : '답변'}
                      </button>
                    </div>

                    <p className="text-[11px] text-apple-tertiary">
                      {new Date(inq.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ══════════ 탭 3: 문제 열람 ══════════ */}
        {tab === 'questions' && (
          <div className="space-y-5 fade-in">
            {/* 컨트롤 */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 챕터 선택 */}
              <div className="relative">
                <select
                  value={selChapter}
                  onChange={e => setSelChapter(e.target.value)}
                  className="appearance-none h-10 rounded-apple border border-apple-border pl-4 pr-8 text-[13px] text-apple-text bg-white focus:outline-none focus:border-apple-blue transition-colors">
                  {CHAPTERS.filter(c => CONTENT_READY.includes(c.id)).map(ch => (
                    <option key={ch.id} value={ch.id}>CH{ch.number} {ch.title}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-apple-secondary pointer-events-none" />
              </div>
              {/* 유형 토글 */}
              <div className="flex rounded-apple overflow-hidden border border-apple-border">
                {(['quiz', 'practice'] as const).map(t => (
                  <button key={t} onClick={() => setQType(t)}
                    className={`px-4 h-10 text-[13px] font-semibold transition-colors ${
                      qType === t ? 'bg-apple-blue text-white' : 'bg-white text-apple-secondary hover:text-apple-text'
                    }`}>
                    {t === 'quiz' ? `퀴즈 (${quizData.length})` : `실습 (${practiceData.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* 퀴즈 목록 */}
            {qType === 'quiz' && (
              <div className="space-y-3">
                {['basic', 'intermediate', 'advanced'].map(lvl => {
                  const questions = quizData.filter(q => q.level === lvl)
                  if (!questions.length) return null
                  const lvlLabel = lvl === 'basic' ? '하 (기초)' : lvl === 'intermediate' ? '중 (응용)' : '상 (심화)'
                  const lvlColor = lvl === 'basic' ? '#34C759' : lvl === 'intermediate' ? '#FF9500' : '#FF3B30'
                  return (
                    <div key={lvl}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: lvlColor }} />
                        <span className="text-[13px] font-bold text-apple-text">{lvlLabel}</span>
                        <span className="text-[12px] text-apple-secondary">{questions.length}문제</span>
                      </div>
                      <div className="space-y-2">
                        {questions.map((q, i) => (
                          <div key={q.id} className="bg-white rounded-apple-lg shadow-apple p-4">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-[13px] text-apple-text leading-relaxed flex-1 whitespace-pre-wrap">{i + 1}. {q.question}</p>
                              <button onClick={() => setShowAnswer(m => ({ ...m, [q.id]: !m[q.id] }))}
                                className="flex items-center gap-1 text-[11px] text-apple-secondary hover:text-apple-blue flex-shrink-0 transition-colors">
                                {showAnswer[q.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                                {showAnswer[q.id] ? '숨기기' : '정답'}
                              </button>
                            </div>
                            <div className="mt-2 space-y-1">
                              {q.options.map((opt, oi) => (
                                <p key={oi} className={`text-[12px] px-3 py-1.5 rounded ${
                                  showAnswer[q.id] && oi === q.correctAnswer
                                    ? 'bg-green-50 text-apple-green font-semibold'
                                    : 'text-apple-secondary'
                                }`}>
                                  {String.fromCharCode(65 + oi)}. {opt}
                                </p>
                              ))}
                            </div>
                            {showAnswer[q.id] && (
                              <div className="mt-2 bg-blue-50 rounded-apple px-3 py-2 text-[12px] text-apple-text">
                                <span className="font-semibold text-apple-blue">해설: </span>{q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* 실습 목록 */}
            {qType === 'practice' && (
              <div className="space-y-3">
                {Array.from(new Set(practiceData.map(p => p.group))).map(grp => {
                  const problems = practiceData.filter(p => p.group === grp)
                  const groupTitle = problems[0]?.groupTitle ?? `그룹 ${grp}`
                  return (
                    <div key={grp}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 rounded-full bg-apple-blue" />
                        <span className="text-[13px] font-bold text-apple-text">그룹 {grp}: {groupTitle}</span>
                      </div>
                      <div className="space-y-2">
                        {problems.map((p, i) => (
                          <div key={p.id} className="bg-white rounded-apple-lg shadow-apple p-4 space-y-2">
                            <p className="text-[13px] font-semibold text-apple-text">{i + 1}. {p.question}</p>
                            <pre className="bg-[#1D1D1F] text-[#A8FF78] text-[12px] rounded-apple p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">{p.sql}</pre>
                            {p.result && (
                              <div className="text-[12px] text-apple-secondary">
                                <span className="font-semibold text-apple-text">결과: </span>{p.result}
                              </div>
                            )}
                            <div className="text-[12px] bg-yellow-50 border border-yellow-200 rounded-apple px-3 py-2 text-apple-text">
                              <span className="font-semibold text-yellow-700">핵심 포인트: </span>{p.keyPoint}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════ 탭 4: 챕터 관리 ══════════ */}
        {tab === 'chapters' && (
          <div className="space-y-4 fade-in">
            <div className="bg-blue-50 border border-apple-blue/20 rounded-apple px-4 py-3 text-[13px] text-apple-text">
              <span className="font-semibold text-apple-blue">안내: </span>
              공개 여부는 이 브라우저의 로컬 설정으로 저장됩니다. 학습자 브라우저에는 별도로 반영되지 않습니다.
              콘텐츠가 없는 챕터는 이미 잠금 상태로 표시됩니다.
            </div>

            <div className="bg-white rounded-apple-xl shadow-apple overflow-hidden">
              <div className="px-5 py-4 border-b border-apple-border flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-apple-text">챕터 공개 여부</h2>
                <span className="text-[12px] text-apple-secondary">숨김 {hidden.length}개</span>
              </div>
              <div className="divide-y divide-apple-border">
                {CHAPTERS.map(ch => {
                  const hasContent = CONTENT_READY.includes(ch.id)
                  const isHidden   = hidden.includes(ch.id)
                  return (
                    <div key={ch.id} className="flex items-center px-5 py-3.5 gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: hasContent ? '#0071E315' : '#8E8E9315' }}>
                        <span className="text-[12px] font-bold" style={{ color: hasContent ? '#0071E3' : '#8E8E93' }}>
                          {ch.number}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-apple-text truncate">{ch.title}</p>
                        <p className="text-[11px] text-apple-secondary">
                          {hasContent ? `퀴즈 ${ch.quizCount}문제 · 실습 ${ch.practiceCount}문제` : '콘텐츠 준비 중'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!hasContent && (
                          <span className="text-[11px] text-apple-tertiary bg-apple-gray-bg px-2 py-0.5 rounded-full">
                            미준비
                          </span>
                        )}
                        <button
                          onClick={() => hasContent && toggleHidden(ch.id)}
                          disabled={!hasContent}
                          className={`flex items-center gap-1.5 text-[12px] font-semibold transition-colors ${
                            !hasContent
                              ? 'text-apple-tertiary cursor-not-allowed'
                              : isHidden
                              ? 'text-apple-tertiary hover:text-apple-orange'
                              : 'text-apple-green hover:text-apple-orange'
                          }`}>
                          {isHidden
                            ? <><ToggleLeft size={20} className="text-apple-tertiary" /> 숨김</>
                            : <><ToggleRight size={20} className="text-apple-green" /> 공개</>
                          }
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
