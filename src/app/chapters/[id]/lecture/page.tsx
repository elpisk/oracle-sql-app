'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getChapter } from '@/data/chapters'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-apple-text mb-4 mt-6 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-apple-text mb-3 mt-6 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[16px] font-semibold text-apple-text mb-2 mt-4">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-[15px] font-semibold text-apple-secondary mb-2 mt-3">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-[15px] leading-relaxed text-apple-text mb-3">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-apple-text">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-apple-secondary">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-3 text-[15px] text-apple-text pl-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 mb-3 text-[15px] text-apple-text pl-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-apple-blue pl-4 py-1 my-3 bg-blue-50 rounded-r-lg text-[14px] text-apple-secondary">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <code className="text-green-400 text-[13px] font-mono">{children}</code>
      )
    }
    return (
      <code className="bg-apple-gray-bg text-[#D73A49] text-[13px] font-mono px-1.5 py-0.5 rounded">{children}</code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-[#1C1C1E] rounded-apple p-4 mb-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-[14px] border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-apple-gray-bg">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-apple-border px-3 py-2 text-left font-semibold text-apple-text text-[13px]">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-apple-border px-3 py-2 text-apple-text text-[13px]">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="even:bg-apple-gray-bg/50">{children}</tr>
  ),
  hr: () => (
    <hr className="border-apple-border my-4" />
  ),
}

function splitSections(text: string): string[] {
  // '## ' 기준으로 섹션 분리 (첫 번째 # 챕터 제목은 스킵)
  const lines = text.split('\n')
  const sections: string[] = []
  let current: string[] = []
  let started = false

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (started && current.length > 0) {
        sections.push(current.join('\n').trim())
      }
      current = [line]
      started = true
    } else if (started) {
      current.push(line)
    }
    // # 으로 시작하는 챕터 제목 행은 스킵
  }

  if (current.length > 0 && started) {
    sections.push(current.join('\n').trim())
  }

  return sections.length > 0 ? sections : [text]
}

export default function LecturePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const ch = getChapter(id)
  const [sections, setSections] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hasFile, setHasFile] = useState(true)

  useEffect(() => {
    setCurrent(0)
    setLoading(true)
    fetch(`/lectures/${id}.md`)
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.text()
      })
      .then(text => {
        const parts = splitSections(text)
        setSections(parts)
        setHasFile(true)
        setLoading(false)
      })
      .catch(() => {
        setHasFile(false)
        setSections(['## 강의 자료 준비 중\n\n이 챕터의 강의 자료는 현재 준비 중입니다.'])
        setLoading(false)
      })
  }, [id])

  if (!ch) { router.push('/'); return null }

  const isLast = current === sections.length - 1
  const sec = sections[current] ?? ''

  return (
    <div className="min-h-screen bg-apple-bg flex flex-col">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 bg-white/90 border-b border-apple-border px-6 py-3"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-[13px] text-apple-secondary mb-2">
            <button
              onClick={() => router.push(`/chapters/${id}`)}
              className="flex items-center gap-1 hover:text-apple-text transition-colors"
            >
              <ArrowLeft size={14} /> CH{ch.number} {ch.title}
            </button>
            <span className="font-semibold text-apple-text">
              {loading ? '...' : `${current + 1} / ${sections.length}`}
            </span>
          </div>
          {!loading && (
            <div className="h-1 rounded-full bg-apple-gray-bg overflow-hidden">
              <div
                className="h-full bg-apple-blue rounded-full transition-all duration-500"
                style={{ width: `${((current + 1) / sections.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 fade-up" key={current}>
        {loading ? (
          <div className="text-apple-secondary text-center pt-20 text-[15px]">로딩 중...</div>
        ) : !hasFile ? (
          <div className="text-center pt-20">
            <p className="text-apple-secondary text-[15px]">이 챕터의 강의 자료는 현재 준비 중입니다.</p>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={mdComponents}
          >
            {sec}
          </ReactMarkdown>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <div className="sticky bottom-0 bg-white/90 border-t border-apple-border px-6 py-4"
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setCurrent(p => p - 1)}
            disabled={current === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-apple-border text-[14px] font-medium text-apple-text
              disabled:opacity-30 hover:bg-apple-gray-bg transition-colors"
          >
            <ArrowLeft size={14} /> 이전
          </button>

          {isLast ? (
            <button
              onClick={() => router.push(`/chapters/${id}`)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-apple-blue text-white text-[14px] font-semibold hover:bg-apple-blue-dark transition-colors"
            >
              완료 <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => setCurrent(p => p + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-blue text-white text-[14px] font-semibold hover:bg-apple-blue-dark transition-colors"
            >
              다음 <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
