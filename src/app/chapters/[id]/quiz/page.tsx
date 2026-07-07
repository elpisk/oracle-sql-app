'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { getChapter } from '@/data/chapters'
import { getQuiz } from '@/data/quiz'
import { saveQuizAttempt } from '@/lib/store'
import { track } from '@/lib/tracker_new'
import Badge from '@/components/Badge'
import type { QuizQuestion, QuizAttempt } from '@/lib/types'

type AnswerRecord = { selected: number; correct: boolean }

export default function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const ch      = getChapter(id)
  const allQuestions = getQuiz(id)

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState<Record<number, AnswerRecord>>({})
  const [selected,  setSelected]  = useState<number | null>(null)
  const [revealed,  setRevealed]  = useState(false)

  useEffect(() => {
    if (!allQuestions.length) return
    setQuestions([...allQuestions].sort(() => Math.random() - 0.5))
  }, [allQuestions.length]) // eslint-disable-line

  if (!ch || !questions.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-apple-secondary">준비 중인 콘텐츠입니다.</p>
    </div>
  )

  const q     = questions[current]
  const total = questions.length
  const isLast = current === total - 1
  const LEVEL_MAP = { basic: 'basic', intermediate: 'intermediate', advanced: 'advanced' } as const

  const handleSelect = (idx: number) => {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    const correct = idx === q.correctAnswer
    setAnswers(prev => ({ ...prev, [q.id]: { selected: idx, correct } }))
  }

  const handleNext = () => {
    if (isLast) {
      const correctCount = Object.values({ ...answers, [q.id]: { selected: selected ?? -1, correct: selected === q.correctAnswer } }).filter(a => a.correct).length
      const finalAnswers = Object.entries({ ...answers, [q.id]: { selected: selected ?? -1, correct: selected === q.correctAnswer } }).map(([qid, a]) => ({
        questionId: Number(qid), selected: a.selected, correct: a.correct,
      }))
      const attempt: QuizAttempt = {
        chapterId: id,
        score: correctCount,
        total,
        answers: finalAnswers,
        completedAt: new Date().toISOString(),
      }
      saveQuizAttempt(attempt)
      track({ type: 'quiz', chapterId: id, score: correctCount, total })
      router.push(`/chapters/${id}/quiz/result?score=${correctCount}&total=${total}`)
    } else {
      const next = current + 1
      const nextQ = questions[next]
      const prevAnswer = answers[nextQ?.id]
      setCurrent(next)
      if (prevAnswer) {
        setSelected(prevAnswer.selected)
        setRevealed(true)
      } else {
        setSelected(null)
        setRevealed(false)
      }
    }
  }

  const handlePrev = () => {
    if (current === 0) return
    const prev  = current - 1
    const prevQ = questions[prev]
    const prevAnswer = answers[prevQ.id]
    setCurrent(prev)
    if (prevAnswer) {
      setSelected(prevAnswer.selected)
      setRevealed(true)
    } else {
      setSelected(null)
      setRevealed(false)
    }
  }

  const progress = Math.round(((current + 1) / total) * 100)
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-apple-bg flex flex-col">
      {/* 상단 바 */}
      <div className="sticky top-[52px] z-40 bg-white/90 border-b border-apple-border px-6 py-3"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => router.push(`/chapters/${id}`)}
              className="flex items-center gap-1 text-[13px] text-apple-secondary hover:text-apple-text transition-colors">
              <ArrowLeft size={14} /> CH{ch.number} 퀴즈
            </button>
            <div className="flex items-center gap-2">
              <Badge variant={LEVEL_MAP[q.level]} size="sm" />
              <span className="text-[13px] font-semibold text-apple-text">{current + 1} / {total}</span>
            </div>
          </div>
          <div className="h-1 rounded-full bg-apple-gray-bg overflow-hidden">
            <div className="h-full bg-apple-blue rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* 문제 */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 fade-in" key={current}>
        <p className="text-[12px] font-semibold text-apple-secondary uppercase tracking-wider mb-4">문제 {current + 1}</p>
        <h2 className="text-[17px] font-semibold text-apple-text leading-relaxed mb-6 whitespace-pre-wrap">{q.question}</h2>

        {q.code && (
          <pre className="mb-6 text-[12.5px]"><code className="text-green-400">{q.code}</code></pre>
        )}

        {/* 선택지 */}
        <div className="space-y-3 mb-8">
          {q.options.map((opt, i) => {
            const isCorrect  = i === q.correctAnswer
            const isSelected = i === selected
            let bg   = 'bg-white border-apple-border hover:border-apple-blue hover:bg-blue-50/30'
            let icon = null

            if (revealed) {
              if (isCorrect) {
                bg   = 'bg-green-50 border-apple-green'
                icon = <CheckCircle2 size={18} className="text-apple-green flex-shrink-0" />
              } else if (isSelected) {
                bg   = 'bg-red-50 border-apple-red'
                icon = <XCircle size={18} className="text-apple-red flex-shrink-0" />
              } else {
                bg = 'bg-white border-apple-border opacity-50'
              }
            }

            return (
              <button key={i} onClick={() => handleSelect(i)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-apple border-2 transition-all ${bg} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-colors
                  ${revealed && isCorrect ? 'bg-apple-green text-white' : revealed && isSelected ? 'bg-apple-red text-white' : 'bg-apple-gray-bg text-apple-secondary'}`}>
                  {['①','②','③','④'][i]}
                </span>
                <span className="text-[14px] text-apple-text flex-1">{opt}</span>
                {icon}
              </button>
            )
          })}
        </div>

        {/* 해설 */}
        {revealed && (
          <div className="bg-blue-50 border border-apple-blue/20 rounded-apple p-4 mb-8 fade-in">
            <p className="text-[12px] font-semibold text-apple-blue mb-1">💡 해설</p>
            <p className="text-[14px] text-apple-text leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 — 항상 표시 */}
      <div className="sticky bottom-0 bg-white/90 border-t border-apple-border px-6 py-4"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* 이전 버튼 */}
          <button onClick={handlePrev} disabled={current === 0}
            className="h-12 px-5 border-2 border-apple-border rounded-full text-apple-text font-semibold text-[15px]
              disabled:opacity-30 hover:bg-apple-gray-bg transition-colors flex items-center gap-2 flex-shrink-0">
            <ArrowLeft size={16} /> 이전
          </button>

          {/* 다음 / 결과 버튼 (답 선택 후에만 활성화) */}
          <button onClick={handleNext} disabled={!revealed}
            className="flex-1 h-12 bg-apple-blue hover:bg-apple-blue-dark text-white font-semibold text-[15px] rounded-full
              transition-colors flex items-center justify-center gap-2 disabled:opacity-40">
            {isLast
              ? (revealed ? <>결과 보기 <ArrowRight size={16} /></> : `${answeredCount}/${total} 답변됨`)
              : (revealed ? <>다음 문제 <ArrowRight size={16} /></> : '선택지를 고르세요')
            }
          </button>
        </div>
      </div>
    </div>
  )
}
