'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ChevronDown, MessageSquare, CheckCircle2, Clock } from 'lucide-react'
import { CHAPTERS } from '@/data/chapters'
import { getInquiries, saveInquiry, getProfile } from '@/lib/store'
import type { Inquiry } from '@/lib/types'

type InquiryType = 'lecture' | 'quiz_error' | 'other'

const TYPE_LABELS: Record<InquiryType, string> = {
  lecture:    '강의 내용 질문',
  quiz_error: '퀴즈 오류 신고',
  other:      '기타',
}

export default function InquiriesPage() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [form, setForm] = useState({
    chapterId:     'ch24',
    problemNumber: '',
    type:          'lecture' as InquiryType,
    content:       '',
  })
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [tab, setTab]         = useState<'write' | 'list'>('write')

  useEffect(() => {
    const profile = getProfile()
    if (!profile) { router.replace('/profile/setup'); return }
    setInquiries(getInquiries())
  }, []) // eslint-disable-line

  const availableChapters = CHAPTERS.filter(c => c.available)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim()) return
    setSending(true)

    saveInquiry({
      chapterId:     form.chapterId,
      problemNumber: form.problemNumber || undefined,
      type:          form.type,
      content:       form.content.trim(),
    })
    setInquiries(getInquiries())
    setForm(f => ({ ...f, content: '', problemNumber: '' }))
    setSending(false)
    setSent(true)
    setTimeout(() => { setSent(false); setTab('list') }, 1500)
  }

  return (
    <div className="min-h-screen bg-apple-bg pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-b from-[#1D1D1F] to-[#2D2D2F] text-white px-6 pt-14 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">문의하기</h1>
          <p className="text-gray-400 text-[16px]">강의·퀴즈에 대해 궁금한 점을 남겨 주세요.</p>
        </div>
      </div>

      {/* 탭 */}
      <div className="sticky top-[52px] z-40 bg-white/90 border-b border-apple-border"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto flex">
          {(['write', 'list'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-[14px] font-semibold transition-colors ${
                tab === t
                  ? 'text-apple-blue border-b-2 border-apple-blue'
                  : 'text-apple-secondary hover:text-apple-text'
              }`}>
              {t === 'write' ? '새 문의' : `내 문의 (${inquiries.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-6 fade-in">
        {tab === 'write' ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-apple-xl shadow-apple p-6 space-y-5">
            {/* 챕터 선택 */}
            <div>
              <label className="block text-[13px] font-semibold text-apple-text mb-1.5">챕터</label>
              <div className="relative">
                <select value={form.chapterId}
                  onChange={e => setForm(f => ({ ...f, chapterId: e.target.value }))}
                  className="w-full appearance-none h-11 rounded-apple border border-apple-border pl-4 pr-10 text-[14px] text-apple-text bg-white focus:outline-none focus:border-apple-blue transition-colors">
                  {availableChapters.map(ch => (
                    <option key={ch.id} value={ch.id}>CH{ch.number} — {ch.title}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-secondary pointer-events-none" />
              </div>
            </div>

            {/* 문의 유형 */}
            <div>
              <label className="block text-[13px] font-semibold text-apple-text mb-1.5">문의 유형</label>
              <div className="flex gap-2">
                {(Object.keys(TYPE_LABELS) as InquiryType[]).map(t => (
                  <button key={t} type="button"
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`flex-1 py-2 rounded-apple text-[12px] font-semibold transition-colors border-2 ${
                      form.type === t
                        ? 'bg-apple-blue border-apple-blue text-white'
                        : 'bg-white border-apple-border text-apple-secondary hover:border-apple-blue'
                    }`}>
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* 문항 번호 (선택) */}
            <div>
              <label className="block text-[13px] font-semibold text-apple-text mb-1.5">
                문항 번호 <span className="text-apple-tertiary font-normal">(선택)</span>
              </label>
              <input type="text" placeholder="예: 3번, 퀴즈 15번"
                value={form.problemNumber}
                onChange={e => setForm(f => ({ ...f, problemNumber: e.target.value }))}
                className="w-full h-11 rounded-apple border border-apple-border px-4 text-[14px] focus:outline-none focus:border-apple-blue transition-colors placeholder:text-apple-tertiary" />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-[13px] font-semibold text-apple-text mb-1.5">문의 내용</label>
              <textarea required placeholder="궁금한 점이나 오류를 자세히 작성해 주세요."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={5}
                className="w-full rounded-apple border border-apple-border px-4 py-3 text-[14px] resize-none focus:outline-none focus:border-apple-blue transition-colors placeholder:text-apple-tertiary" />
            </div>

            <button type="submit" disabled={sending || sent || !form.content.trim()}
              className={`w-full h-12 rounded-full text-[15px] font-semibold transition-all flex items-center justify-center gap-2 ${
                sent
                  ? 'bg-apple-green text-white'
                  : 'bg-apple-blue hover:bg-apple-blue-dark text-white disabled:opacity-50'
              }`}>
              {sent
                ? <><CheckCircle2 size={18} /> 전송 완료!</>
                : <><Send size={16} /> 문의 전송</>
              }
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="text-center py-20 text-apple-secondary">
                <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-[15px]">아직 문의 내역이 없습니다.</p>
              </div>
            ) : (
              [...inquiries].reverse().map(inq => {
                const ch = CHAPTERS.find(c => c.id === inq.chapterId)
                const isPending = inq.status === 'pending'
                return (
                  <div key={inq.id} className="bg-white rounded-apple-lg shadow-apple p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-semibold text-apple-blue bg-blue-50 px-2 py-0.5 rounded-full mr-2">
                          {TYPE_LABELS[inq.type]}
                        </span>
                        {ch && <span className="text-[11px] text-apple-secondary">CH{ch.number} {ch.title}</span>}
                        {inq.problemNumber && <span className="text-[11px] text-apple-secondary ml-1">· {inq.problemNumber}</span>}
                      </div>
                      <span className={`flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 ${
                        isPending ? 'text-apple-orange' : 'text-apple-green'
                      }`}>
                        {isPending ? <><Clock size={11} /> 답변 대기</> : <><CheckCircle2 size={11} /> 답변 완료</>}
                      </span>
                    </div>
                    <p className="text-[14px] text-apple-text leading-relaxed mb-2">{inq.content}</p>
                    {inq.answer && (
                      <div className="bg-blue-50 border border-apple-blue/20 rounded-apple px-4 py-3 mt-3">
                        <p className="text-[11px] font-semibold text-apple-blue mb-1">강사 답변</p>
                        <p className="text-[13px] text-apple-text">{inq.answer}</p>
                      </div>
                    )}
                    <p className="text-[11px] text-apple-tertiary mt-2">
                      {new Date(inq.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
